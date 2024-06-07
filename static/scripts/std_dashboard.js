$(document).ready(function () {
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)jwtAccess\s*=\s*([^;]*).*$)|^.*$/, '$1');
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  const userId = JSON.parse(jsonPayload).user_id;
  const handleAjaxError = (jqXHR, textStatus) => {
    $('#flash-message').text(
      jqXHR?.responseJSON?.detail ||
      jqXHR?.responseJSON?.username ||
      jqXHR?.responseJSON?.email ||
      textStatus);
    $('#flash-message').show();
  };

  const populateUserProfile = (data) => {
    const courses = data.courses;
    const coursesContainer = $('.courses');

    courses.forEach(course => {
      coursesContainer.append(`<div class="course">${course.title}</div>`);
    });
  };

  const getUserProfile = (userId, token) => {
    $.ajax({
      url: 'http://127.0.0.1/api/accounts/students/' + userId + '/',
      type: 'GET',
      headers: {
        Authorization: 'Bearer ' + token
      },
      success: populateUserProfile,
      error: handleAjaxError
    });
  };

  getUserProfile(userId, token);
});
