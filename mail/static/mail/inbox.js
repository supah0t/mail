document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#send').addEventListener('click', () => post_mail());

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#mail-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function show_mail(mail_id) {

  //Show specific mail view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#mail-view').style.display = 'block';

  fetch('/emails/' + mail_id)
  .then(response => response.json())
  .then(email => {

    let data = email;
    let mainContainer = document.querySelector('#mail-view');
    mainContainer.innerHTML = "";

    const neededInfo = [data.sender, data.recipients, data.subject, data.timestamp, data.body];


    let div = document.createElement('div');
    div.className = 'mailInfo';
    div.innerHTML = `
      <table>
        <tr>
          <th>From: <th>
          <td>${data.sender}</td>
        </tr>
      
        <tr>
          <th>Το: <th>
          <td>${data.recipients}</td>
        </tr>

        <tr>
          <th>Subject: <th>
          <td>${data.subject}</td>
        </tr>

        <tr>
          <th>Sent: <th>
          <td>${data.timestamp}</td>
        </tr>
      </table>
      <hr>
      <h6>${data.body}</h6>
    `

    mainContainer.appendChild(div);
  });
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#mail-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;


  fetch('/emails/' + mailbox)
  .then(response => response.json())
  .then(email => {
    
    data = email;
    let mainContainer = document.getElementById("emails-view");

    for (let i = 0; i < data.length; i++) {
      let div = document.createElement("div");
      div.style = "cursor: pointer;"
      div.className = 'mailList';


      if (data[i].read === true && mailbox == "inbox") {
        div.style.background = '#C7C6C6';
      }

      div.innerHTML = `<table class="mailTable"><tr> <th class="firstElement">${data[i].recipients}</th> <td>${data[i].subject}</td> <td class="timeField">${data[i].timestamp}</td> </tr></table>`
      
      div.addEventListener('click', () => show_mail(data[i].id));

      mainContainer.appendChild(div);
    }
  });

}

function post_mail() {

  //Gets form values
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  //Posts mail to /emails route.
  fetch('/emails', {
    method: 'POST', 
    body: JSON.stringify({
      "recipients": recipients,
      "subject": subject,
      "body": body
    })
  })
  .then(response => response.json())
  .then(result => {
    //Print result
    console.log(result);

  });
}