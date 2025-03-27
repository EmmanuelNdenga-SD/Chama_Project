// Global variables
let members = [];
const membershipFee = 1000;

// DOM elements
const memberForm = document.getElementById('memberForm');
const membersList = document.getElementById('membersList');

// Event Listeners
memberForm.addEventListener('submit', addMember);
document.addEventListener('DOMContentLoaded', loadMembers);

// Functions
function loadMembers() {
  // In a real app, you would fetch this from a server
  // For now, we'll use the data from our JSON file
  fetch('members.json')
    .then(response => response.json())
    .then(data => {
      members = data;
      displayMembers();
    })
    .catch(error => {
      console.error('Error loading members:', error);
      members = [];
    });
}

function displayMembers() {
  membersList.innerHTML = '';
  
  if (members.length === 0) {
    membersList.innerHTML = '<p>No members found.</p>';
    return;
  }

  members.forEach(member => {
    const memberCard = document.createElement('div');
    memberCard.className = 'member-card';
    
    const memberInfo = document.createElement('div');
    memberInfo.className = 'member-info';
    memberInfo.innerHTML = `
      <p><strong>Name:</strong> ${member.name}</p>
      <p><strong>Phone:</strong> ${member.phone}</p>
      ${member.email ? `<p><strong>Email:</strong> ${member.email}</p>` : ''}
      <p><strong>Payment Status:</strong> 
        <span class="payment-status ${member.hasPaid ? 'paid' : 'unpaid'}">
          ${member.hasPaid ? 'Paid' : 'Unpaid'}
        </span>
      </p>
      ${member.paymentDate ? `<p><strong>Payment Date:</strong> ${member.paymentDate}</p>` : ''}
    `;
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => removeMember(member.id));
    
    memberCard.appendChild(memberInfo);
    memberCard.appendChild(removeBtn);
    membersList.appendChild(memberCard);
  });
}

function addMember(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;
  
  const newMember = {
    id: Date.now(), // Simple unique ID
    name,
    phone,
    email: email || null,
    paymentDate: new Date().toISOString().split('T')[0],
    hasPaid: true
  };
  
  members.push(newMember);
  displayMembers();
  
  // Reset form
  memberForm.reset();
  
  // In a real app, you would send this to a server
  console.log('New member added:', newMember);
  alert(`Member added successfully! ${name} has paid ${membershipFee} KSH.`);
}

function removeMember(id) {
  if (confirm('Are you sure you want to remove this member?')) {
    members = members.filter(member => member.id !== id);
    displayMembers();
    
    // In a real app, you would update the server
    console.log('Member removed with ID:', id);
  }
}