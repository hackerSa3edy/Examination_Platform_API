$(document).ready(function () {
  // Check first if the exam title and id is present in the url, if not
  // don't load anything and tell the user that the exam title and id is not present
  const params = new URLSearchParams(window.location.search);

  const examTitle = params.get('exam_title');
  const examId = params.get('exam_id');

  if (!(examTitle && examId)) {
    $('body').empty(); // Clear the entire page
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
        font-family: Arial, sans-serif; // Add this line
      ">
        The exam_id or exam_title or both are missing
      </div>
    `);
    return; // Stop further execution
  }

  const token = document.cookie.replace(/(?:(?:^|.*;\s*)jwtAccess\s*=\s*([^;]*).*$)|^.*$/, '$1');
  // const base64Url = token.split('.')[1];
  // const base64 = base64Url.replace('-', '+').replace('_', '/');
  // const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
  // return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  // }).join(''));

  // Initial fetch of questions
  $.ajax({
    url: `http://127.0.0.1/api/exams/questions/?exam_id=${examId}&exam_title=${examTitle}`,
    type: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    },
    success: function (response) {
      updateQuestionsAndButtons(response);
    }
  });

  function updateQuestionsAndButtons (response) {
    // Update questions on the page
    $('.questions').empty();
    $.each(response.results, function (i, question) {
      const questionDiv = $('<div>').addClass('q1');
      const titleDiv = $('<div>').addClass('title');
      const h4 = $('<h4>').text(question.text);
      titleDiv.append(h4);
      questionDiv.append(titleDiv);
      const answersDiv = $('<div>').addClass('answers');
      $.each(question.choices, function (j, choice) {
        const p = $('<p>').text(choice.text);
        answersDiv.append(p);
      });
      questionDiv.append(answersDiv);
      $('.questions').append(questionDiv);
    });

    // Update next and previous buttons
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
  }

  // Event handlers for next and previous buttons
  $('button:contains("Next"), button:contains("Previous")').click(function () {
    const url = $(this).data('url');
    if (url) {
      $.ajax({
        url: url,
        type: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        },
        success: function (response) {
          updateQuestionsAndButtons(response);
        }
      });
    }
  });

  const answers = $('.answers');
  answers.each(function () {
    const element = $(this).children().toArray();
    console.log(element);
    element.forEach(function (ele) {
      $(ele).click(function () {
        element.forEach(function (ele) {
          $(ele).removeClass('element');
        });
        $(this).toggleClass('element');
      });
    });
  });
});
