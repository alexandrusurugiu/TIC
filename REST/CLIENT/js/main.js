console.log('Client script loaded!')

// API configuration
const API_BASE_URL = 'http://localhost:5000'

// Get DOM elements for add product form
const productsContainer = document.getElementById('products')
const addProductButton = document.getElementById('add-product')
const productNameInput = document.getElementById('name')
const productPriceInput = document.getElementById('price')

// Get DOM elements for update product form
const updateProductButton = document.getElementById('update-product')
const updateIdInput = document.getElementById('update-id')
const updateNameInput = document.getElementById('update-name')
const updatePriceInput = document.getElementById('update-price')

// Get DOM elements for delete product form
const deleteProductButton = document.getElementById('delete-product')
const deleteIdInput = document.getElementById('delete-id')

// Display products as HTML elements
function displayData(products) {
    productsContainer.innerHTML = '' // Clear previous content

    // Check if products array is empty
    if (!products || products.length === 0) {
        productsContainer.innerHTML = '<p>No products available</p>'
        return
    }

    // Create HTML element for each product
    products.forEach(product => {
        const productDiv = document.createElement('div')

        const idElement = document.createElement('p')
        idElement.textContent = `ID: ${product.id}`

        const nameElement = document.createElement('p')
        nameElement.textContent = `Name: ${product.name}`

        const priceElement = document.createElement('p')
        priceElement.textContent = `Price: ${product.price}`

        const separator = document.createElement('hr')

        productDiv.appendChild(idElement)
        productDiv.appendChild(nameElement)
        productDiv.appendChild(priceElement)
        productDiv.appendChild(separator)

        productsContainer.appendChild(productDiv)
    })
}

// READ - Get all items from API
async function getItems() {
    console.log('Fetching all items...')
    try {
        const response = await fetch(`${API_BASE_URL}/items`)
        const data = await response.json()
        displayData(data)
    } catch(error) {
        console.error('Error fetching items:', error)
    }
}

// CREATE - Add a new product
async function addProduct() {
    const newProduct = {
        name: productNameInput.value,
        price: productPriceInput.value
    }

    // Validate input
    if (!newProduct.name || !newProduct.price) {
        alert('Please enter both name and price')
        return
    }

    console.log('Adding product:', newProduct)

    try {
        const response = await fetch(`${API_BASE_URL}/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProduct)
        })
        const data = await response.json()
        console.log('Product added with ID:', data.id)

        // Clear input fields
        productNameInput.value = ''
        productPriceInput.value = ''

        // Refresh the product list
        await getItems()

    } catch(error) {
        console.error('Error adding product:', error)
    }
}

// UPDATE - Update an existing product
async function updateProduct() {
    const id = updateIdInput.value
    const updatedProduct = {
        name: updateNameInput.value,
        price: updatePriceInput.value
    }

    // Validate ID
    if (!id) {
        alert('Please enter a product ID')
        return
    }

    console.log('Updating product ID', id, 'with:', updatedProduct)

    try {
        const response = await fetch(`${API_BASE_URL}/items/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProduct)
        })

        if (!response.ok) {
            const error = await response.json()
            alert(error.error || 'Error updating product')
            return
        }

        const data = await response.json()
        console.log('Product updated:', data)

        // Clear input fields
        updateIdInput.value = ''
        updateNameInput.value = ''
        updatePriceInput.value = ''

        // Refresh the product list
        await getItems()

    } catch(error) {
        console.error('Error updating product:', error)
    }
}

// DELETE - Delete a product
async function deleteProduct() {
    const id = deleteIdInput.value

    // Validate ID
    if (!id) {
        alert('Please enter a product ID')
        return
    }

    if (!confirm(`Are you sure you want to delete product ID ${id}?`)) {
        return
    }

    console.log('Deleting product ID:', id)

    try {
        const response = await fetch(`${API_BASE_URL}/items/${id}`, {
            method: 'DELETE'
        })

        if (!response.ok) {
            const error = await response.json()
            alert(error.error || 'Error deleting product')
            return
        }

        const data = await response.json()
        console.log('Product deleted:', data.message)

        // Clear input field
        deleteIdInput.value = ''

        // Refresh the product list
        await getItems()

    } catch(error) {
        console.error('Error deleting product:', error)
    }
}

// Event listeners
addProductButton.addEventListener('click', addProduct)
updateProductButton.addEventListener('click', updateProduct)
deleteProductButton.addEventListener('click', deleteProduct)

// Load products on page load
getItems()