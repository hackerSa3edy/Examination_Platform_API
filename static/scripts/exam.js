$(document).ready(function () {
  const BASE_URL = 'http://127.0.0.1/api/exams/';
  const params = new URLSearchParams(window.location.search);
  const examTitle = params.get('exam_title');
  const examId = params.get('exam_id');

  if (!(examTitle && examId)) {
    $('body').empty();
    $('body').append(`
      <div id="message" style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px;
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
        border-radius: .25rem;
        text-align: center;
        font-size: 1.25rem;
        font-family: Arial, sans-serif;
      ">
        The exam_id or exam_title or both are missing
      </div>
    `);
    return;
  }

  const token = document.cookie.replace(/(?:(?:^|.*;\s*)jwtAccess\s*=\s*([^;]*).*$)|^.*$/, '$1');
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  const studentId = JSON.parse(jsonPayload).user_id;
  // const studentId = 6;

  function sendRequest (url, type, data, successCallback) {
    $.ajax({
      url: url,
      type: type,
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: successCallback,
      error: function (jqXHR, textStatus, errorThrown) {
        $('.questions').html(`<div class="error">${jqXHR?.responseJSON?.detail || textStatus}</div>`);
        $('button').prop('disabled', true);
      }
    });
  }

  sendRequest(`${BASE_URL}questions/?exam_id=${examId}&exam_title=${examTitle}`, 'GET', null, updateQuestionsAndButtons);

  function updateQuestionsAndButtons (response) {
    $('.questions').empty();
    $.each(response.results, function (i, question) {
      const questionDiv = $('<div>').addClass('q1').data('question-id', question.id);
      const titleDiv = $('<div>').addClass('title');
      const h4 = $('<h4>').text(question.text);
      titleDiv.append(h4);
      questionDiv.append(titleDiv);
      const answersDiv = $('<div>').addClass('answers');
      $.each(question.choices, function (j, choice) {
        const p = $('<p>').text(choice.text).data('choice-id', choice.id).data('question-id', question.id);
        answersDiv.append(p);
      });
      questionDiv.append(answersDiv);
      $('.questions').append(questionDiv);
    });

    if (response.next) {
      $('button:contains("Next")').prop('disabled', false).data('url', response.next);
    } else {
      $('button:contains("Next")').prop('disabled', true).removeData('url');
    }
    if (response.previous) {
      $('button:contains("Previous")').prop('disabled', false).data('url', response.previous);
    } else {
      $('button:contains("Previous")').prop('disabled', true).removeData('url');
    }

    sendRequest('http://127.0.0.1/api/exams/answers/', 'GET', null, function (answersResponse) {
      $.each(answersResponse.results, function (i, answer) {
        const questionDiv = $('.q1').filter(function () {
          return $(this).data('question-id') === answer.question.id;
        });
        questionDiv.data('answer-id', answer.id);
        const choiceP = questionDiv.find('p').filter(function () {
          return $(this).data('choice-id') === answer.student_choice.id;
        });
        choiceP.addClass('element');
      });
    });
  }

  let counter = 1;

  $('.prev-next').click(function () {
    $('.error').remove();
    const direction = $(this).data('direction');
    const url = $(this).data('url');
    if (url) {
      sendRequest(url, 'GET', null, function (response) {
        updateQuestionsAndButtons(response);
        if (direction === 'next') {
          counter++;
        } else if (direction === 'prev' && counter > 1) {
          counter--;
        }
        $('#counter').text(counter);
      });
    }
  });

  $('body').on('click', 'div.answers p', function () {
    const choiceId = $(this).data('choice-id');
    const questionId = $(this).data('question-id');
    const questionDiv = $('.q1').filter(function () {
      return $(this).data('question-id') === questionId;
    });
    const answerId = questionDiv.data('answer-id');

    if (answerId) {
      sendRequest(`${BASE_URL}answers/${answerId}/`, 'PUT', { student_choice: choiceId }, function (response) {
        questionDiv.find('.element').removeClass('element');
        $(this).addClass('element');
      });
    } else {
      sendRequest(`${BASE_URL}answers/`, 'POST', {
        student: studentId,
        exam: examId,
        question: questionId,
        student_choice: choiceId
      }, function (response) {
        questionDiv.data('answer-id', response.id);
        questionDiv.find('.element').removeClass('element');
        $(this).addClass('element');
      });
    }
  });
});
