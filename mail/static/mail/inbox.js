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
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  
  
  fetch('/emails/sent')
  .then(response => response.json())
  .then(email => {
    
    data = email;
    console.log(data);
    let mainContainer = document.getElementById("emails-view");

    for (let i = 0; i < data.length; i++) {
      let div = document.createElement("div");
      div.className = 'mailList';

      div.innerHTML = 'Name: ' + data[i].recipients + ', Subject: ' + data[i].subject;
      mainContainer.appendChild(div);
    }
  });

}

function post_mail() {

  //Posts mail to /emails route.
  fetch('/emails', {
    method: 'POST', 
    body: JSON.stringify({
      "recipients": "test@example.com",
      "subject": "First Test",
      "body": "This is a test"
    })
  })
  .then(response => response.json())
  .then(result => {
    //Print result
    console.log(result);
  });

}