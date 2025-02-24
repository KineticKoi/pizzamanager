'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const devMode = false; //SET TO TRUE TO USE LOCALHOST, FALSE TO USE SERVER (THIS WOULD NORMALLY BE IN A .ENV FILE)
    const base_url = devMode ? 'http://localhost:5000' : 'http://3.149.249.254:5000'; //BASE URL FOR API (THESE WOULD NORMALLY BE IN A .ENV FILE)
    const [loading, setLoading] = useState(true);
    const [userType, setUserType] = useState(null);

    const router = useRouter();

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('userType');
        if (!isAuthenticated) {
            router.push('./login');
        }
        else {
            setUserType(localStorage.getItem('userType'));
        }
    }, [router]);

    /////////////////////////// TOPPINGS FUNCTIONS ///////////////////////////
    const [editingToppingIndex, setEditingToppingIndex] = useState(null); //EDITING INDEX STATE (THIS IS THE INDEX OF THE TOPPING BEING EDITED)
    const [editedTopping, setEditedTopping] = useState({}); //EDITED TOPPING STATE (THIS IS THE TOPPING BEING EDITED)
    const [newTopping, setNewTopping] = useState(null); //NEW TOPPING STATE (THIS IS THE TOPPING BEING CREATED)
    const [isNewTopping, setIsNewTopping] = useState(false); //BOOLEAN TO CHECK IF NEW TOPPING IS BEING CREATED
    const handleCreateNewTopping = () => {
        setNewTopping({
            id: null,
            name: "",
            price: 0.00,
        });
        setIsNewTopping(true);
    }

    const handleSaveNewTopping = async () => {
        try {
            const response = await fetch(`${base_url}/create_topping`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    topping: newTopping,
                }),
            });
            const data = await response.json();
            if (data.success) {
                newTopping.id = data.id;
                setToppings((prevToppings) => [...prevToppings, newTopping].sort((a, b) => a.id - b.id)); //WHEN NEW TOPPING IS ADDED, SORT TOPPINGS BY ID
                setNewTopping(null);
                setIsNewTopping(false);
                document.getElementById("message-toppings-text").innerText = "Topping created successfully.";
            } 
            else {
                console.error("Failed to create topping:", data.error || "Unknown error");
                document.getElementById("message-toppings-text").innerText = "Failed to create topping: " + (data.error || "Unknown error");
            }
        } 
        catch (error) {
            console.error("Error creating topping:", error);
        }
    };

    const handleCancelNewTopping = () => {
        setNewTopping(null);
        setIsNewTopping(false);
    }

    const deleteTopping = async (topping) => {
        try {
            const response = await fetch(`${base_url}/delete_topping`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ id: topping.id }),
            });
            const data = await response.json();
            if (data.success) {
                setToppings((prevToppings) => prevToppings.filter(t => t.id !== topping.id));
                document.getElementById("message-toppings-text").innerText = "Topping deleted successfully.";
            }
            else {
                console.error("Failed to delete topping:", data.error || "Unknown error");
                document.getElementById("message-toppings-text").innerText = "Failed to delete topping: " + (data.error || "Unknown error");
            }
        }
        catch (error) {
            console.error("Error deleting topping:", error);
        }
    };

    const handleToppingEdit = (topping, index) => {
        setEditedTopping({ //SET THE EDITED TOPPING TO THE SELECTED TOPPING
            id: topping.id,
            name: topping.name,
            price: topping.price,
        });
        setEditingToppingIndex(index);
    };

    const handleToppingSave = async () => {
        try {
            const response = await fetch(`${base_url}/update_topping`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    id: editedTopping.id,
                    topping: {
                        name: editedTopping.name,
                        price: editedTopping.price,
                    },
                }),
            });
            const data = await response.json();
            if (data.success) {
                setToppings((prevToppings) =>
                    prevToppings.map((t, index) =>
                        index === editingToppingIndex ? editedTopping : t
                    )
                );
            }
            else {
                console.error("Failed to update topping:", data.error || "Unknown error");
                document.getElementById("message-toppings-text").innerText = "Failed to update topping: " + (data.error || "Unknown error");
            }
        }
        catch (error) {
            console.error("Error updating topping:", error);
            document.getElementById("message-toppings-text").innerText = "Error updating topping: " + error;
        }
        setEditingToppingIndex(null);
        setEditedTopping({});
    };

    /////////////////////////// PIZZA FUNCTIONS ///////////////////////////

    const [editingPizzaIndex, setPizzaEditingIndex] = useState(null); //EDITING INDEX STATE (THIS IS THE INDEX OF THE PIZZA BEING EDITED)
    const [editedPizza, setEditedPizza] = useState({}); //EDITED PIZZA STATE (THIS IS THE PIZZA BEING EDITED)

    const handlePizzaEdit = (pizza, index) => {
        setEditedPizza({ //SET THE EDITED PIZZA TO THE SELECTED PIZZA
            id: pizza.id,
            name: pizza.name,
            price: pizza.price,
            toppings: [...pizza.toppings],
        });
        setPizzaEditingIndex(index);
    };

    const handleChange = (e, type = 'edit') => {
        const { name, value, checked } = e.target;
        let value_as_number = Number(value); //CONVERT STRING VALUE TO NUMBER (MUST BE DONE AS LIMITATION OF CHECKBOXES)
        
        if (type === 'edit') { // HANDLING editedPizza
            if (name === "toppings") {
                let updatedToppings = [...editedPizza.toppings];
                if (checked) {
                    updatedToppings.push(value_as_number); //ADD TOPPING IF CHECKED
                    updatedToppings.sort((a, b) => a - b); //SORT TOPPINGS (KEEPS ORDER CONSISTENT)
                } 
                else {
                    updatedToppings = updatedToppings.filter(id => id !== value_as_number); //REMOVE TOPPING IF UNCHECKED
                }
                setEditedPizza((prevPizza) => ({ //UPDATE THE EDITED PIZZA WITH THE NEW TOPPINGS
                    ...prevPizza,
                    [name]: updatedToppings,
                }));
            } 
            else {
                setEditedPizza((prevPizza) => ({
                    ...prevPizza,
                    [name]: value,
                }));
            }
        } 
        else if (type === 'new') { // HANDLING newPizza
            if (name === "toppings") {
                let updatedToppings = [...newPizza.toppings];
                if (checked) {
                    updatedToppings.push(value_as_number); //ADD TOPPING IF CHECKED
                    updatedToppings.sort((a, b) => a - b); //SORT TOPPINGS (KEEPS ORDER CONSISTENT)
                } 
                else {
                    updatedToppings = updatedToppings.filter(id => id !== value_as_number); //REMOVE TOPPING IF UNCHECKED
                }
                setNewPizza((prevPizza) => ({ //UPDATE THE NEW PIZZA WITH THE NEW TOPPINGS
                    ...prevPizza,
                    [name]: updatedToppings,
                }));
            } 
            else {
                setNewPizza((prevPizza) => ({
                    ...prevPizza,
                    [name]: value,
                }));
            }
        }
    };

    const handlePizzaEditCancel = () => {
        setPizzaEditingIndex(null);
        setEditedPizza({});
    };

    //HANDLE SAVE FUNCTION (PUT REQUEST TO UPDATE PIZZA)
    const handlePizzaSave = async () => {
        try {
            const response = await fetch(`${base_url}/update_pizza`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    id: editedPizza.id,
                    pizza: {
                        name: editedPizza.name,
                        price: editedPizza.price,
                        toppings: editedPizza.toppings,
                    },
                }),
            });

            const data = await response.json();

            if (data.success) {
                setPizzas((prevPizzas) =>
                    prevPizzas.map((p, index) =>
                        index === editingPizzaIndex ? editedPizza : p
                    )
                );
                document.getElementById("message-pizzas-text").innerText = "Pizza updated successfully.";
            } 
            else {
                console.error("Failed to update pizza:", data.error || "Unknown error");
                document.getElementById("message-pizzas-text").innerText = "Failed to update pizza: " + (data.error || "Unknown error");
            }
        } catch (error) {
            console.error("Error updating pizza:", error);
        }
        setPizzaEditingIndex(null);
        setEditedPizza({});
    };

    const [toppings, setToppings] = useState([]);
    const [pizzas, setPizzas] = useState([]);

    useEffect(() => {
        if (userType) {
            const getToppings = async () => {
                try {
                    const response = await fetch(`${base_url}/get_toppings`);
                    const data = await response.json();
                    setToppings(data.toppings);
                }
                catch (error) {
                    console.error('Error fetching toppings:', error);
                }
            };

            const getPizzas = async () => {
                try {
                    const response = await fetch(`${base_url}/get_pizzas`);
                    const data = await response.json();
                    setPizzas(data.pizzas);
                }
                catch (error) {
                    console.error('Error fetching pizzas:', error);
                }
                finally {
                    setLoading(false);
                }
            };

            //GET TOPPINGS AND PIZZAS IN ORDER TO RENDER THE PAGE
            getToppings().finally(() => getPizzas());
        }
    }, [userType]);

    useEffect(() => {
        if (pizzas.length > 0 && toppings.length > 0) {
            setLoading(false);
        }
    }, [toppings, pizzas]);

    const deletePizza = async (pizza) => {
        try {
            const response = await fetch(`${base_url}/delete_pizza`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ id: pizza.id }),
            });
    
            const data = await response.json();
    
            if (data.success) {
                setPizzas((prevPizzas) => prevPizzas.filter(p => p.id !== pizza.id));
                document.getElementById("message-pizzas-text").innerText = "Pizza deleted successfully.";
            } 
            else {
                console.error("Failed to delete pizza:", data.error || "Unknown error");
                document.getElementById("message-pizzas-text").innerText = "Failed to delete pizza: " + (data.error || "Unknown error");
            }
        } catch (error) {
            console.error("Error deleting pizza:", error);
        }
    };

    const [newPizza, setNewPizza] = useState(null); //NEW PIZZA STATE (THIS IS THE PIZZA BEING CREATED)
    const [isNewPizza, setIsNewPizza] = useState(false); //BOOLEAN TO CHECK IF NEW PIZZA IS BEING CREATED
    const handleCreateNewPizza = () => {
        setNewPizza({
            id: null,
            name: "",
            price: 0.00,
            toppings: [],
        });
        setIsNewPizza(true);
    }

    const handleSaveNewPizza = async () => {
        try {
            const response = await fetch(`${base_url}/create_pizza`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    pizza: newPizza,
                }),
            });

            const data = await response.json();

            if (data.success) {
                newPizza.id = data.id;
                setPizzas((prevPizzas) => [...prevPizzas, newPizza].sort((a, b) => a.id - b.id)); //WHEN NEW PIZZA IS ADDED, SORT PIZZAS BY ID
                setIsNewPizza(false);
                setNewPizza(null);
                document.getElementById("message-pizzas-text").innerText = "Pizza created successfully.";
            } 
            else {
                console.error("Failed to create pizza:", data.error || "Unknown error");
                document.getElementById("message-pizzas-text").innerText = "Failed to create pizza: " + (data.error || "Unknown error");
            }
        }
        catch (error) {
            console.error("Error creating pizza:", error);
        }
    };

    const handleCancelNewPizza = () => {
        setNewPizza(null);
        setIsNewPizza(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('userType');
        router.push('./login');
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <center>
            <header style={{
                position: 'relative', 
                textAlign: 'center', 
                padding: '20px 0',
                }}>
                {/* Conditionally render header based on userType */}
                {userType === 'storeOwner' && <h1>Store Owner Portal!</h1>}
                {userType === 'chef' && <h1>Chef Portal!</h1>}

                {/* Log Out Button with Absolute Positioning */}
                {(userType === 'storeOwner' || userType === 'chef') && (
                    <button className='sml-btn' 
                    onClick={handleLogout} 
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        width: '100px',
                    }}
                    >
                    Log Out
                    </button>
                )}
            </header>
            </center>
            <div id="view-pizzas" className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Pizzas</h2>
                    <button className="sml-btn" onClick={handleCreateNewPizza}>
                        <i class="bi bi-plus-lg"></i>
                    </button>
                </div>

                {loading ? (
                    <p>Loading pizzas...</p>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Toppings</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {isNewPizza && (
                            <tr className="d-flex justify-content-between">
                                <td>
                                <input
                                    type="text"
                                    name="name"
                                    value={newPizza.name || ''}
                                    onChange={(e) =>
                                    setNewPizza({ ...newPizza, name: e.target.value })
                                    }
                                    placeholder="Pizza Name"
                                />
                                </td>
                                <td>
                                <input
                                    type="number"
                                    name="price"
                                    value={newPizza.price || ''}
                                    onChange={(e) => {
                                    const value = e.target.value;
                                    const regex = /^\d+(\.\d{0,2})?$/; //REGEX TO ALLOW 2 DECIMAL PLACES
                                    if (regex.test(value) || value === '') {
                                        setNewPizza({ ...newPizza, price: value }); //UPDATE NEW PIZZA PRICE
                                    }
                                    }}
                                    placeholder="Price"
                                    step="0.01" //STEP TO ALLOW 2 DECIMAL PLACES
                                />
                                </td>
                                <td>
                                {toppings.map((topping) => (
                                    <div key={topping.id} className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        name="toppings"
                                        value={topping.id}
                                        checked={newPizza.toppings.includes(topping.id)}
                                        onChange={(e) => handleChange(e, 'new')}
                                    />
                                    <label className="form-check-label">{topping.name}</label>
                                    </div>
                                ))}
                                </td>
                                <td>
                                <button className='saveButton' onClick={handleSaveNewPizza}>Save</button>
                                <button className='cancelButton' onClick={handleCancelNewPizza}>Cancel</button>
                                </td>
                                <td></td>
                            </tr>
                            )}
                            {pizzas.map((pizza, index) => (
                            <tr key={index} className="d-flex justify-content-between">
                                <td>
                                {editingPizzaIndex === index ? (
                                    <input
                                    type="text"
                                    name="name"
                                    value={editedPizza.name}
                                    onChange={handleChange}
                                    />
                                ) : (
                                    pizza.name
                                )}
                                </td>
                                <td>
                                {editingPizzaIndex === index ? (
                                    <input
                                    type="number"
                                    name="price"
                                    value={editedPizza.price || ''}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const regex = /^\d*\.?\d{0,2}$/; //REGEX TO ALLOW 2 DECIMAL PLACES
                                        if (regex.test(value)) {
                                        setEditedPizza({ ...editedPizza, price: value });
                                        }
                                    }}
                                    placeholder="Price"
                                    step="0.01" //STEP TO ALLOW 2 DECIMAL PLACES
                                    />
                                ) : (
                                    `$${pizza.price}`
                                )}
                                </td>
                                <td style={{ minWidth: '200px' }}>
                                {editingPizzaIndex === index ? (
                                    toppings.map((topping) => (
                                    <div key={topping.id} className="form-check">
                                        <input
                                        type="checkbox"
                                        className="form-check-input"
                                        name="toppings"
                                        value={topping.id}
                                        checked={editedPizza.toppings.includes(topping.id)}
                                        onChange={handleChange}
                                        />
                                        <label className="form-check-label">{topping.name}</label>
                                    </div>
                                    ))
                                ) : (
                                    pizza.toppings
                                    .map((id) => {
                                        const topping = toppings.find((topping) => topping.id === id);
                                        return topping ? topping.name : 'Unregistered Topping';
                                    })
                                    .join(', ')
                                )}
                                </td>
                                <td style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                {editingPizzaIndex === index ? (
                                    <>
                                    <button className='saveButton' onClick={handlePizzaSave}>Save</button>
                                    <button className='cancelButton' onClick={handlePizzaEditCancel}>Cancel</button>
                                    </>
                                ) : (
                                    <button onClick={() => handlePizzaEdit(pizza, index)} className='editButton' style={{ marginRight: '10px' }}>
                                        <i className="bi bi-pencil"></i>
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to delete this pizza?')) {
                                            deletePizza(pizza);
                                        }
                                    }}
                                    className='deleteButton'>
                                    <i class="bi bi-trash3-fill"></i>
                                </button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                )}
            </div>

            <div id="message-pizzas" className="container">
                <p id="message-pizzas-text"></p>
            </div>

            {userType === 'storeOwner' && (
                <div id="update-toppings" className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2>Toppings</h2>
                        <button className="sml-btn" onClick={handleCreateNewTopping}>
                            <i class="bi bi-plus-lg"></i>
                        </button>
                    </div>

                    {loading ? (
                        <p>Loading toppings...</p>
                    ) : (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Add New Topping Row */}
                                {isNewTopping && (
                                <tr className="d-flex justify-content-between">
                                    <td>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newTopping.name || ''}
                                        onChange={(e) =>
                                        setNewTopping({ ...newTopping, name: e.target.value })
                                        }
                                        placeholder="Topping Name"
                                    />
                                    </td>
                                    <td>
                                    <input
                                        type="number"
                                        name="price"
                                        value={newTopping.price || ''}
                                        onChange={(e) => {
                                        const value = e.target.value;
                                        
                                        const regex = /^\d+(\.\d{0,2})?$/; //REGEX TO ALLOW 2 DECIMAL PLACES
                                        if (regex.test(value) || value === '') {
                                            setNewTopping({ ...newTopping, price: parseFloat(value) });
                                        }
                                        }}
                                        placeholder="Price"
                                        step="0.01" //STEP TO ALLOW 2 DECIMAL PLACES
                                    />
                                    </td>
                                    <td>
                                        <button className='saveButton' onClick={handleSaveNewTopping}>Save</button>
                                        <button className='cancelButton' onClick={handleCancelNewTopping}>Cancel</button>
                                    </td>
                                    <td></td>
                                </tr>
                                )}

                                {/* Toppings List */}
                                {toppings.map((topping, index) => (
                                <tr key={index} className="d-flex justify-content-between">
                                    <td>
                                    {editingToppingIndex === index ? (
                                        <input
                                        type="text"
                                        name="name"
                                        value={editedTopping.name || ''}
                                        onChange={(e) =>
                                            setEditedTopping({ ...editedTopping, name: e.target.value })
                                        }
                                        />
                                    ) : (
                                        topping.name
                                    )}
                                    </td>
                                    <td>
                                    {editingToppingIndex === index ? (
                                        <input
                                        type="number"
                                        name="price"
                                        value={editedTopping.price || ''}
                                        onChange={(e) => {
                                            const value = e.target.value;

                                            const regex = /^\d+(\.\d{0,2})?$/; //REGEX TO ALLOW 2 DECIMAL PLACES
                                            if (regex.test(value) || value === '') {
                                            setEditedTopping({ ...editedTopping, price: parseFloat(value) });
                                            }
                                        }}
                                        placeholder='Price'
                                        step="0.01" //STEP TO ALLOW 2 DECIMAL PLACES
                                        />
                                    ) : (
                                        `$${topping.price}`
                                    )}
                                    </td>
                                    <td style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    {editingToppingIndex === index ? (
                                        <div>
                                            <button className='saveButton' onClick={handleToppingSave}>Save</button>
                                            <button className='cancelButton' onClick={() => setEditingToppingIndex(null)}>Cancel</button>
                                        </div>
                                    ) : (
                                        <button onClick={() => handleToppingEdit(topping, index)} className='editButton'>
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to delete this topping?')) {
                                                deleteTopping(topping);
                                            }
                                        }}
                                        className='deleteButton'
                                        style={{ marginLeft: '10px' }}>
                                        <i class="bi bi-trash3-fill"></i>
                                    </button>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        <div id="message-toppings" className="container">
            <p id="message-toppings-text"></p>
        </div>
        <footer>
            <p>&copy; 2025 Pizza Store Management</p>
        </footer>

        <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.min.js"></script>
        </div>
    );
}
