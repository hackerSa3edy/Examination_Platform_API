$(document).ready(function () {
  function getUserProfile (userId, token) {
    // Fetch data from API endpoint
    $.ajax({
      url: url + userId + '/',
      type: 'GET',
      headers: {
        Authorization: 'Bearer ' + token
      },
      success: function (data) {
        // Insert data into HTML page
        $('#userName').val(data.username);
        $('.profile p').text(data.username);
        $('.mainData h3').text(data.username);

        $('#userEmail').val(data.email);

        $('#city').val(data.city);

        if ('level' in data) {
          $('#h-level').text('Level ' + data.level);
          $('#level').val(data.level);
        } else {
          $('#level').hide();
          $('#h-level').hide();
        }

        $('#name1').val(data.first_name);
        $('#name2').val(data.second_name);
        $('#name3').val(data.third_name);
        $('#name4').val(data.fourth_name);
        $('#gender').val(data.gender);
        $('#birth_date').val(data.birth_date);
        $('#address').val(data.address);
        $('#phone_number').val(data.phone);

        if ('department' in data) {
          $('#department').val(data.department.title);
        } else {
          $('#department').hide();
        }

        if ('specialization' in data) {
          $('#specialization').val(data.courses[0].title);
        } else {
          $('#specialization').hide();
        }

        $('#joined_at').text('Joined at : ' + new Date(data.date_joined).toLocaleDateString());
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Insert error message into HTML page
        $('#flash-message').text(jqXHR?.responseJSON?.detail || textStatus);
        $('#flash-message').show();
      }
    });
  }

  function getURL (userRole) {
    const baseURL = 'http://127.0.0.1/api/accounts/';
    let url;

    switch (userRole) {
      case 'admin':
        url = baseURL + 'admins/';
        break;
      case 'instructor':
        url = baseURL + 'instructors/';
        break;
      case 'student':
        url = baseURL + 'students/';
        break;
      default:
        url = baseURL; // default URL if no role matches
    }

    return url;
  }

  // Extract JWT token from cookie
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)jwtAccess\s*=\s*([^;]*).*$)|^.*$/, '$1');

  // Decode JWT token to get USER_ID
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  const userId = JSON.parse(jsonPayload).user_id;
  const userRole = JSON.parse(jsonPayload).user_role;
  const url = getURL(userRole);
  getUserProfile(userId, token);

  // on updating data
  $('#update').click(function () {
    $('input').each(function (el) {
      $(this).removeAttr('readonly');
      // console.log("abeer");
    });
    $('select').each(function (el) {
      $(this).prop('disabled', false);
    });
    $(this).css('background-color', 'white'); // Change the button color to green
  });

  // on saving data
  $('#save').click(function () {
    // Collect user data
    const userData = {};

    const fields = [
      'userName', 'userEmail', 'city', 'level', 'name1', 'name2', 'name3', 'name4',
      'gender', 'birth_date', 'address', 'phone_number', 'department', 'specialization'
    ];

    fields.forEach(field => {
      if (!$(`#${field}`).is(':hidden')) {
        userData[field] = $(`#${field}`).val();
      }
    });

    // Send PUT request
    $.ajax({
      url: url + userId + '/',
      type: 'PUT',
      headers: {
        Authorization: 'Bearer ' + token
      },
      contentType: 'application/json',
      data: JSON.stringify(userData),
      success: function (data) {
        // Refresh user profile

        // Insert data into HTML page
        $('#userName').val(data.username);
        $('.profile p').text(data.username);
        $('.mainData h3').text(data.username);

        $('#userEmail').val(data.email);

        $('#city').val(data.city);

        if ('level' in data) {
          $('#h-level').text('Level ' + data.level);
          $('#level').val(data.level);
        } else {
          $('#level').hide();
          $('#h-level').hide();
        }

        $('#name1').val(data.first_name);
        $('#name2').val(data.second_name);
        $('#name3').val(data.third_name);
        $('#name4').val(data.fourth_name);
        $('#gender').val(data.gender);
        $('#birth_date').val(data.birth_date);
        $('#address').val(data.address);
        $('#phone_number').val(data.phone);

        if ('department' in data) {
          $('#department').val(data.department.title);
        } else {
          $('#department').hide();
        }

        if ('specialization' in data) {
          $('#specialization').val(data.courses[0].title);
        } else {
          $('#specialization').hide();
        }

        $('#joined_at').text('Joined at : ' + new Date(data.date_joined).toLocaleDateString());
        // Make all inputs readonly
        $('input').each(function (el) {
          $(this).attr('readonly', 'true');
        });

        // Disable all select elements
        $('select').each(function (el) {
          $(this).prop('disabled', true);
        });

        // Change the button color to green
        $('#update').css('background-color', '#b3d6f5');
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Insert error message into HTML page
        $('#flash-message').text(jqXHR.responseJSON.detail || textStatus);
        $('#flash-message').show();
      }
    });
  });
});
