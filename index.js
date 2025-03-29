const API_BASE_URL = 'https://my-app-backend-e4c6.onrender.com/api/members';
const membershipFee = 1000;

let members = [];
const memberForm = document.getElementById('memberForm');
const membersList = document.getElementById('membersList');

// Event Listeners
memberForm.addEventListener('submit', addMember);
document.addEventListener('DOMContentLoaded', loadMembers);

async function loadMembers() {
  try {
    console.log('Loading members...'); // Debug log
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    members = await response.json();
    console.log('Members loaded:', members); // Debug log
    displayMembers();
  } catch (error) {
    console.error('Error loading members:', error);
    membersList.innerHTML = '<p class="error">Error loading members. Please refresh.</p>';
  }
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
    memberCard.dataset.id = member._id || member.id; // Handle both _id and id
    
    memberCard.innerHTML = `
      <div class="member-info">
        <p><strong>Name:</strong> ${member.name}</p>
        <p><strong>Phone:</strong> ${member.phone}</p>
        ${member.email ? `<p><strong>Email:</strong> ${member.email}</p>` : ''}
        <p><strong>Payment Status:</strong> 
          <span class="payment-status ${member.hasPaid ? 'paid' : 'unpaid'}">
            ${member.hasPaid ? 'Paid' : 'Unpaid'}
          </span>
        </p>
        ${member.paymentDate ? `<p><strong>Payment Date:</strong> ${member.paymentDate}</p>` : ''}
      </div>
      <button class="remove-btn" data-id="${member._id || member.id}">Remove</button>
    `;
    
    memberCard.querySelector('.remove-btn').addEventListener('click', async (e) => {
      const memberId = e.target.getAttribute('data-id');
      console.log('Attempting to remove member with ID:', memberId); // Debug log
      await removeMember(memberId);
    });
    
    membersList.appendChild(memberCard);
  });
}

async function addMember(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  
  if (!name || !phone) {
    alert('Please fill in all required fields (name and phone)');
    return;
  }

  const newMember = {
    name,
    phone,
    email: email || null,
    paymentDate: new Date().toISOString(),
    hasPaid: true
  };

  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMember)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add member');
    }

    const addedMember = await response.json();
    members.push(addedMember);
    displayMembers();
    memberForm.reset();
    alert(`Member added successfully! ${name} has paid ${membershipFee} KSH.`);
  } catch (error) {
    console.error('Error adding member:', error);
    alert(`Failed to add member: ${error.message}`);
  }
}

async function removeMember(id) {
  if (!id) {
    console.error('No member ID provided for deletion');
    alert('Error: No member ID provided');
    return;
  }

  if (!confirm('Are you sure you want to remove this member?')) return;

  try {
    console.log('Sending DELETE request for ID:', id); // Debug log
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('DELETE response:', response); // Debug log
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('DELETE error response:', errorText); // Debug log
      throw new Error(errorText || 'Failed to delete member');
    }

    // Update local state only after successful backend deletion
    members = members.filter(member => (member._id || member.id) !== id);
    displayMembers();
    alert('Member removed successfully!');
  } catch (error) {
    console.error('Error removing member:', error);
    alert(`Failed to remove member: ${error.message}`);
  }
}