const API_BASE_URL = 'http://localhost:5000';

let authToken = localStorage.getItem('authToken');
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

const authSection = document.getElementById('auth-section');
const userInfoSection = document.getElementById('user-info');
const mainSection = document.getElementById('main-section');
const currentUserEmail = document.getElementById('current-user-email');

const loginButton = document.getElementById('login-button');
const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');

const registerButton = document.getElementById('register-button');
const registerEmailInput = document.getElementById('register-email');
const registerPasswordInput = document.getElementById('register-password');

const logoutButton = document.getElementById('logout-button');

const productsContainer = document.getElementById('products');

const addProductButton = document.getElementById('add-product');
const productNameInput = document.getElementById('name');
const productPriceInput = document.getElementById('price');

const updateProductButton = document.getElementById('update-product');
const updateIdInput = document.getElementById('update-id');
const updateNameInput = document.getElementById('update-name');
const updatePriceInput = document.getElementById('update-price');

const deleteProductButton = document.getElementById('delete-product');
const deleteIdInput = document.getElementById('delete-id');

async function login() {
    const email = loginEmailInput.value.trim();
    const password = loginPasswordInput.value;

    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            alert('Login successful!');

            loginEmailInput.value = '';
            loginPasswordInput.value = '';

            updateUIForAuth();
            await getItems();
        } else {
            alert(`Login failed: ${data.error}`);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    }
}

async function register() {
    const email = registerEmailInput.value.trim();
    const password = registerPasswordInput.value;

    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password })
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            alert('Registration successful!');

            registerEmailInput.value = '';
            registerPasswordInput.value = '';

            updateUIForAuth();
            await getItems();
        } else {
            console.log('Server error:', data); 

            alert('An error accured. PLease check the console.');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed. Please try again.');
    }
}

function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');

    alert('Logged out successfully');
    updateUIForAuth();
}

function updateUIForAuth() {
    if (authToken && currentUser) {
        authSection.style.display = 'none';
        userInfoSection.style.display = 'block';
        mainSection.style.display = 'block';
        currentUserEmail.textContent = currentUser.email;
    } else {
        authSection.style.display = 'block';
        userInfoSection.style.display = 'none';
        mainSection.style.display = 'none';
    }
}

function displayData(products) {
    productsContainer.innerHTML = '';

    if (!products || products.length === 0) {
        productsContainer.innerHTML = '<p>No products available</p>';
        return;
    }

    products.forEach(product => {
        const productDiv = document.createElement('div');

        const idElement = document.createElement('p');
        idElement.textContent = `ID: ${product.id}`;

        const nameElement = document.createElement('p');
        nameElement.textContent = `Name: ${product.name}`;

        const priceElement = document.createElement('p');
        priceElement.textContent = `Price: ${product.price}`;

        const separator = document.createElement('hr');

        productDiv.appendChild(idElement);
        productDiv.appendChild(nameElement);
        productDiv.appendChild(priceElement);
        productDiv.appendChild(separator);

        productsContainer.appendChild(productDiv);
    });
}

async function getItems() {
    try {
        const response = await fetch(`${API_BASE_URL}/items`);

        if (!response.ok) {
            throw new Error('Failed to fetch items');
        }

        const data = await response.json();
        displayData(data);
    } catch(error) {
        console.error('Error fetching items:', error);
        productsContainer.innerHTML = '<p>Error loading products</p>';
    }
}

async function addProduct() {
    if (!authToken) {
        alert('Please login first!');
        return;
    }

    const newProduct = {
        name: productNameInput.value,
        price: productPriceInput.value
    };

    if (!newProduct.name || !newProduct.price) {
        alert('Please enter both name and price');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(newProduct)
        });

        const data = await response.json();

        if (response.ok) {
            alert('Product added successfully!');

            productNameInput.value = '';
            productPriceInput.value = '';

            await getItems();
        } else {
            if (response.status === 401 || response.status === 403) {
                alert('Session expired. Please login again.');
                logout();
            } else {
                alert(`Error: ${data.error}`);
            }
        }
    } catch(error) {
        console.error('Error adding product:', error);
        alert('Failed to add product');
    }
}

async function updateProduct() {
    if (!authToken) {
        alert('Please login first!');
        return;
    }

    const id = updateIdInput.value.trim();
    const updatedProduct = {
        name: updateNameInput.value,
        price: updatePriceInput.value
    };

    if (!id) {
        alert('Please enter a product ID');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/items/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(updatedProduct)
        });

        if (response.ok) {
            alert('Product updated successfully!');

            updateIdInput.value = '';
            updateNameInput.value = '';
            updatePriceInput.value = '';

            await getItems();
        } else {
            const data = await response.json();
            if (response.status === 401 || response.status === 403) {
                alert('Session expired. Please login again.');
                logout();
            } else {
                alert(`Error: ${data.error}`);
            }
        }
    } catch(error) {
        console.error('Error updating product:', error);
        alert('Failed to update product');
    }
}

async function deleteProduct() {
    if (!authToken) {
        alert('Please login first!');
        return;
    }

    const id = deleteIdInput.value.trim();

    if (!id) {
        alert('Please enter a product ID');
        return;
    }

    if (!confirm(`Are you sure you want to delete product ID ${id}?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/items/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            alert('Product deleted successfully!');

            deleteIdInput.value = '';

            await getItems();
        } else {
            const data = await response.json();
            if (response.status === 401 || response.status === 403) {
                alert('Session expired. Please login again.');
                logout();
            } else {
                alert(`Error: ${data.error}`);
            }
        }
    } catch(error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
    }
}

loginButton.addEventListener('click', login);
registerButton.addEventListener('click', register);
logoutButton.addEventListener('click', logout);

addProductButton.addEventListener('click', addProduct);
updateProductButton.addEventListener('click', updateProduct);
deleteProductButton.addEventListener('click', deleteProduct);

window.addEventListener('DOMContentLoaded', () => {
    updateUIForAuth();

    if (authToken) {
        getItems();
    }
});