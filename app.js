const productList = document.querySelector('#products');
const productForm = document.querySelector('#product-form');
const productId = document.querySelector('#product-id');
const productName = document.querySelector('#name');
const productPrice = document.querySelector('#price');
const productDescription = document.querySelector('#description');
const submitButton = document.querySelector('#submit-button');
const updateButton = document.querySelector('#update-button');

// Function to fetch all products from the server
async function fetchProducts() {
  const response = await fetch('http://localhost:3000/products');
  const products = await response.json();

  // Clear product list
  productList.innerHTML = '';

  // Add each product to the list
  products.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `${product.name} - $${product.price} - ${product.description}`;

    // Add delete button for each product
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Delete';
    deleteButton.addEventListener('click', async () => {
      await deleteProduct(product.id);
      await fetchProducts();
    });
    li.appendChild(deleteButton);

    // Add update button for each product
    const updateButton = document.createElement('button');
    updateButton.innerHTML = 'Update';
    updateButton.addEventListener('click', () => {
      productId.value = product.id;
      productName.value = product.name;
      productPrice.value = product.price;
      productDescription.value = product.description;
      submitButton.style.display = 'none';
      updateButton.style.display = 'inline';
    });
    li.appendChild(updateButton);

    productList.appendChild(li);
  });
}

// Event listener for Add Product form submit button
productForm.addEventListener('submit', async event => {
  event.preventDefault();
  const name = productName.value;
  const price = productPrice.value;
  const description = productDescription.value;
  
  if (productId.value) {
    await updateProduct(productId.value, name, price, description);
  } else {
    await addProduct(name, price, description);
  }
  
  productForm.reset();
  productId.value = '';
  submitButton.style.display = 'inline';
  updateButton.style.display = 'none';
  await fetchProducts();
});

// Event listener for Update button
updateButton.addEventListener('click', async () => {
  const id = productId.value;
  const name = productName.value;
  const price = productPrice.value;
  const description = productDescription.value;
  
  await updateProduct(id, name, price, description);
  
  productForm.reset();
  productId.value = '';
  submitButton.style.display = 'inline';
  updateButton.style.display = 'none';
  await fetchProducts();
});

// Function to add a new product
async function addProduct(name, price, description) {
  const response = await fetch('http://localhost:3000/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, price, description })
  });
  return response.json();
}

// Function to update a product
async function updateProduct(id, name, price, description) {
  const response = await fetch(`http://localhost:3000/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, price, description })
  });
  return response.json();
}

// Function to delete a product
async function deleteProduct(id) {
  const response = await fetch('http://localhost:3000/products/' + id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
  });
  return response.json();
}

// Fetch all products on page load
fetchProducts();
