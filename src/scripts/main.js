$(document).ready(function () {
    $('tbody').sortable();

    var lastId = 0;
    var currentSelectedStudent = null;
    var selectedRow = null;
    var savedStudents = localStorage.getItem("students");
    var students = savedStudents ? JSON.parse(savedStudents) : [];
    var isAutosave = true;

    var interval = setInterval(function () {
        updateListOfStudents();
        localStorage.setItem("students", JSON.stringify(students));
    }, 60 * 1000);

    updateTable();

    $('#addStudentButton').on('click', function (e) {
        bootbox.dialog({
            title: "Add new student",
            message: "<div>" +
            "<form>" +
            "<div class='form-group' id='firstNameDiv'>" +
            "<label for='firstNameInput'>First name:</label>" +
            "<input type='text' class='form-control' id='firstNameInput'>" +
            "</div>" +
            "<div class='form-group' id='lastNameDiv'>" +
            "<label for='lastNameInput'>Last name:</label>" +
            "<input type='text' class='form-control' id='lastNameInput'>" +
            "</div>" +
            "<div class='form-group' id='gpaDiv'>" +
            "<label for='gpaInput'>Grade point average:</label>" +
            "<input type='number' class='form-control' id='gpaInput'>" +
            "</div>" +
            "</form>" +
            "</div>",
            buttons: {
                danger: {
                    label: "Cancel",
                    className: "btn-primary",
                    callback: function () {
                        return true;
                    }.bind(this)
                },
                success: {
                    label: "Save",
                    className: "btn-success",
                    callback: function () {
                        var firstName = $('#firstNameInput').val();
                        var lastName = $('#lastNameInput').val();
                        var gpa = $('#gpaInput').val();

                        var currentDate = new Date();
                        var date = currentDate.getFullYear() + "-" +
                                currentDate.getMonth() + 1 + "-" +
                                currentDate.getDate();

                        var time = currentDate.getHours() + ":" +
                                currentDate.getMinutes();

                        var id = ++lastId;

                        if(firstName && lastName && gpa) {
                            var student = new Object();
                            student.id = id;
                            student.firstName = firstName;
                            student.lastName = lastName;
                            student.date = date;
                            student.time = time;
                            student.gpa = gpa;
                            students.push(student);
                            appendStudentToTable(student);
                            localStorage.setItem("students", JSON.stringify(students));
                        } else {
                            if(!firstName)
                                $('#firstNameDiv').addClass('has-error');

                            if(!lastName)
                                $('#lastNameDiv').addClass('has-error');

                            if(!gpa)
                                $('#gpaDiv').addClass('has-error');

                            return false;
                        }
                    }
                }
            }
        });
    });

    $('#editStudentButton').on('click', function (e) {
        bootbox.dialog({
            title: "Edit data of " + currentSelectedStudent.firstName + " " + currentSelectedStudent.lastName,
            message: "<div>" +
            "<form>" +
            "<div class='form-group' id='firstNameDiv'>" +
            "<label for='firstNameInput'>First name:</label>" +
            "<input type='text' class='form-control' id='firstNameInput'>" +
            "</div>" +
            "<div class='form-group' id='lastNameDiv'>" +
            "<label for='lastNameInput'>Last name:</label>" +
            "<input type='text' class='form-control' id='lastNameInput'>" +
            "</div>" +
            "<div class='form-group' id='gpaDiv'>" +
            "<label for='gpaInput'>Grade point average:</label>" +
            "<input type='number' class='form-control' id='gpaInput'>" +
            "</div>" +
            "</form>" +
            "</div>",
            buttons: {
                danger: {
                    label: "Cancel",
                    className: "btn-primary",
                    callback: function () {
                        return true;
                    }.bind(this)
                },
                success: {
                    label: "Save",
                    className: "btn-success",
                    callback: function () {
                        var firstName = $('#firstNameInput').val();
                        var lastName = $('#lastNameInput').val();
                        var gpa = $('#gpaInput').val();

                        var currentDate = new Date();
                        var date = currentDate.getFullYear() + "-" +
                            currentDate.getMonth() + 1 + "-" +
                            currentDate.getDate();

                        var time = currentDate.getHours() + ":" +
                            currentDate.getMinutes();

                        if(firstName && lastName && gpa) {
                            currentSelectedStudent.firstName = firstName;
                            currentSelectedStudent.lastName = lastName;
                            currentSelectedStudent.date = date;
                            currentSelectedStudent.time = time;
                            currentSelectedStudent.gpa = gpa;

                            var i = 0;
                            for(var prop in currentSelectedStudent) {
                                selectedRow.find('td')[i].innerText = currentSelectedStudent[prop];
                                i++;
                            }

                            updateListOfStudents();
                            localStorage.setItem("students", JSON.stringify(students));
                        } else {
                            if(!firstName)
                                $('#firstNameDiv').addClass('has-error');

                            if(!lastName)
                                $('#lastNameDiv').addClass('has-error');

                            if(!gpa)
                                $('#gpaDiv').addClass('has-error');

                            return false;
                        }
                    }
                }
            }
        }).init(function () {
            if(currentSelectedStudent) {
                $('#firstNameInput').val(currentSelectedStudent.firstName);
                $('#lastNameInput').val(currentSelectedStudent.lastName);
                $('#gpaInput').val(currentSelectedStudent.gpa);
            }
        });
    });

    $('#deleteStudentButton').on('click', function (e) {
        bootbox.dialog({
            title: "Delete this note",
            message: "<p>This note will be deleted. Are you sure?</p>",
            buttons: {
                danger: {
                    label: "Cancel",
                    className: "btn-primary",
                    callback: function () {
                        return true;
                    }.bind(this)
                },
                success: {
                    label: "Delete",
                    className: "btn-danger",
                    callback: function () {
                        for(var i in students) {
                            if(students[i].id == currentSelectedStudent.id) {
                                students.splice(i, 1);
                                selectedRow.remove();
                                break;
                            }
                        }
                        localStorage.setItem("students", JSON.stringify(students));
                        currentSelectedStudent = null;
                        $('#editStudentButton').removeClass('active');
                        $('#editStudentButton').removeClass('active');
                        $('#editStudentButton').addClass('disabled');
                        $('#deleteStudentButton').addClass('disabled');
                    }
                }
            }
        });
    });

    $('#saveButton').on('click', function (e) {
        updateListOfStudents();
        localStorage.setItem("students", JSON.stringify(students));
    });

    $('#autosaveToggle').on('change', function () {
        isAutosave = isAutosave ? false : true;
        if(isAutosave) {
            interval = setInterval(function () {
                updateListOfStudents();
                localStorage.setItem("students", JSON.stringify(students));
            }, 60 * 1000);
        } else {
            clearInterval(interval);
        }
    });

    $('#changePasswordButton').on('click', function () {
        bootbox.dialog({
            title: "Change login and password",
            message: "<div>" +
            "<form>" +
            "<div class='form-group' id='loginDiv'>" +
            "<label for='loginInput'>Login:</label>" +
            "<input type='text' class='form-control' id='loginInput'>" +
            "</div>" +
            "<div class='form-group' id='passwordDiv'>" +
            "<label for='passwordInput'>Password:</label>" +
            "<input type='password' class='form-control' id='passwordInput'>" +
            "</div>" +
            "</form>" +
            "</div>",
            buttons: {
                danger: {
                    label: "Cancel",
                    className: "btn-primary",
                    callback: function () {
                        return true;
                    }.bind(this)
                },
                success : {
                    label: "Submit",
                    className: "btn-danger",
                    callback: function () {
                        var log = $('#loginInput').val();
                        var pass = $('#passwordInput').val();
                        if(log && pass) {
                            localStorage.setItem("login", log);
                            localStorage.setItem('password', pass);
                        } else {
                            if(!log && pass ) {
                                $('#loginDiv').addClass('has-error');
                            } else if(log &&  !pass) {
                                $('#passwordDiv').addClass('has-error');
                            } else if(!log  && !pass ) {
                                $('#loginDiv').addClass('has-error');
                                $('#passwordDiv').addClass('has-error');
                            }
                            return false;
                        }
                    }.bind(this)
                }
            }
        });
    });

    $('thead').find('th').on('click', function (e) {
        var id = $(this).attr('id');
        switch (id) {
            case 'idHead':
                students.sort(compareById);
                break;
            case 'firstNameHead':
                students.sort(compareByFirstName);
                break;
            case 'lastNameHead':
                students.sort(compareByLastName);
                break;
            case 'dateHead':
                students.sort(compareByDate);
                break;
            case 'timeHead':
                students.sort(compareByTime);
                break;
            case 'gpaHead':
                students.sort(compareByGpa);
                break;
        }
        $('tbody').find('tr').each(function() {
            $(this).remove();
        })
        updateTable();
    });

    $('#topPanel, #gridPanel, #bottomPanel').on('mouseup', function (e) {
        var container = $("#studentsTable");
        var editStudentButton = $('#editStudentButton');
        var deleteStudentButton = $('#deleteStudentButton');

        if (!container.is(e.target) && container.has(e.target).length === 0 && selectedRow &&
                !editStudentButton.is(e.target) && editStudentButton.has(e.target).length === 0 &&
                !deleteStudentButton.is(e.target) && deleteStudentButton.has(e.target).length === 0 ) {
            selectedRow.removeClass('highlight');
            selectedRow = null;
            currentSelectedStudent = null;
            $('#editStudentButton').removeClass('active');
            $('#editStudentButton').removeClass('active');
            $('#editStudentButton').addClass('disabled');
            $('#deleteStudentButton').addClass('disabled');
        }
    });

    function appendStudentToTable(student) {
        $('tbody').append('<tr>' +
            '<td>' + student.id + '</td>' +
            '<td>' + student.firstName + '</td>' +
            '<td>' + student.lastName + '</td>' +
            '<td>' + student.date + '</td>' +
            '<td>' + student.time + '</td>' +
            '<td>' + student.gpa + '</td>' +
            '</tr>');

        var rows = $('tr').not(':first');
        rows.on('click', function(e) {
            var row = $(this);
            rows.removeClass('highlight');
            row.addClass('highlight');

            $('#editStudentButton').removeClass('disabled');
            $('#deleteStudentButton').removeClass('disabled');
            $('#editStudentButton').addClass('active');
            $('#editStudentButton').addClass('active');

            var currentStudenParams = [];
            if(!currentSelectedStudent)
                currentSelectedStudent = new Object();
            if(row.hasClass('highlight')) {
                selectedRow = row;
                row.find('td').each(function () {
                    currentStudenParams.push($(this).text());
                });
                currentSelectedStudent.id = currentStudenParams[0];
                currentSelectedStudent.firstName = currentStudenParams[1];
                currentSelectedStudent.lastName = currentStudenParams[2];
                currentSelectedStudent.date = currentStudenParams[3];
                currentSelectedStudent.time = currentStudenParams[4];
                currentSelectedStudent.gpa = currentStudenParams[5];
            }
        });
    }

    function updateListOfStudents() {
        var rows = $('tr').not(':first');
        students.splice(0, students.length);
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var student = new Object();
            var studentParams = [];
            $(row).find('td').each(function () {
                studentParams.push($(this).text());
            });
            student.id = studentParams[0];
            student.firstName = studentParams[1];
            student.lastName = studentParams[2];
            student.date = studentParams[3];
            student.time = studentParams[4];
            student.gpa = studentParams[5];
            students.push(student);
        }
    }

    function updateTable() {
        if(students.length) {
            for(var i in students) {
                var student = students[i];
                if(students[i].id > lastId)
                    lastId = students[i].id;
                appendStudentToTable(student);
            }
        }
    }
    
    function compareById(a, b) {
        return a.id - b.id;
    }
    
    function compareByFirstName(a, b) {
        if(a.firstName < b.firstName) return -1;
        if(a.firstName > b.firstName) return 1;
        return 0;
    }

    function compareByLastName(a, b) {
        if(a.lastName < b.lastName) return -1;
        if(a.lastName > b.lastName) return 1;
        return 0;
    }

    function compareByDate(a, b) {
        return new Date(a.date) - new Date(b.date);
    }

    function compareByTime(a, b) {
        if(a.time.split(':')[0] > b.time.split(':')[0]) {
            return 1;
        } else if(a.time.split(':')[0] == b.time.split(':')[0]) {
            if(a.time.split(':')[1] > b.time.split(':')[1])
                return 1;
            else
                return -1;
        }
    }

    function compareByGpa(a, b) {
        return a.gpa - b.gpa;
    }
});