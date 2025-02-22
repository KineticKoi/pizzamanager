'use client';

import { useState, useEffect, use } from 'react';

export default function Home() {
    const [editingPizzaIndex, setPizzaEditingIndex] = useState(null); //EDITING INDEX STATE (THIS IS THE INDEX OF THE PIZZA BEING EDITED)
    const [editedPizza, setEditedPizza] = useState({}); //EDITED PIZZA STATE (THIS IS THE PIZZA BEING EDITED)

    const [editingToppingIndex, setToppingEditingIndex] = useState(null); //EDITING INDEX STATE (THIS IS THE INDEX OF THE TOPPING BEING EDITED)
    const [editedTopping, setEditedTopping] = useState({}); //EDITED TOPPING STATE (THIS IS THE TOPPING BEING EDITED)

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
            } 
            else {
                console.error("Failed to update pizza:", data.message || "Unknown error");
            }
        } catch (error) {
            console.error("Error updating pizza:", error);
        }
        setPizzaEditingIndex(null);
        setEditedPizza({});
    };


    const [currentSection, setCurrentSection] = useState('view-pizzas'); 
    const [toppings, setToppings] = useState([]);
    const [pizzas, setPizzas] = useState([]);
    const [loading, setLoading] = useState(true);
    const base_url = 'http://localhost:5000';

    const showSection = (section) => {
        setCurrentSection(section);
    }

    useEffect(() => {
        const getToppings = async () => {
            try {
                const response = await fetch(`${base_url}/get_toppings`);
                const data = await response.json();
                setToppings(data.toppings);
                setLoading(false);
            }
            catch (error) {
                console.error('Error fetching toppings:', error);
                setLoading(false);
            }
        };
        getToppings();
    }, []);

    useEffect(() => {
        if (toppings.length > 0) {
            const getPizzas = async () => {
                try {
                    const response = await fetch(`${base_url}/get_pizzas`);
                    const data = await response.json();
                    setPizzas(data.pizzas);
                    setLoading(false);
                }
                catch (error) {
                    console.error('Error fetching pizzas:', error);
                    setLoading(false);
                }
            };
            getPizzas();
        }
    }, [toppings]);

    const [userType, setUserType] = useState(null);
    useEffect(() => {
        const login = async () => {
            try {
                const response = await fetch(`${base_url}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username: 'admin', password: 'admin' }),
                });
                const data = await response.json();
                setUserType(data.userType);
                console.log('Logged in as:', data.userType);
            }
            catch (error) {
                console.error('Error logging in:', error);
            }
        };
        login();
    }, []);


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
                },
                body: JSON.stringify({ id: pizza.id }),
            });
    
            const data = await response.json();
    
            if (data.success) {
                setPizzas((prevPizzas) => prevPizzas.filter(p => p.id !== pizza.id));
            } 
            else {
                console.error("Failed to delete pizza:", data.message || "Unknown error");
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
            } 
            else {
                console.error("Failed to create pizza:", data.message || "Unknown error");
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

    return (
        <div>
            <center>
                <header>
                    {userType === 'storeOwner' && (
                        <h1>Store Owner Portal!</h1>
                    )}
                    {userType === 'chef' && (
                        <h1>Chef Portal!</h1>
                    )}
                </header>
            </center>
            {currentSection === 'view-pizzas' && (
                <div id="view-pizzas" className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2>Pizzas</h2>
                        <button className="sml-btn" onClick={handleCreateNewPizza}>
                            <i className="bi bi-pencil"></i>
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
                                                onChange={(e) =>
                                                    setNewPizza({ ...newPizza, price: e.target.value })
                                                }
                                                placeholder="Price"
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
                                            <button onClick={handleSaveNewPizza}>Save</button>
                                            <button onClick={handleCancelNewPizza}>Cancel</button>
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
                                        value={editedPizza.price}
                                        onChange={handleChange}
                                        />
                                    ) : (
                                        `$${pizza.price}`
                                    )}
                                    </td>
                                    <td>
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
                                            pizza.toppings.map((id) => {
                                                const topping = toppings.find((topping) => topping.id === id);
                                                return topping ? topping.name : 'Unregistered Topping';
                                            }).join(', ')
                                        )}
                                    </td>
                                    <td>
                                    {editingPizzaIndex === index ? (
                                        <>
                                        <button onClick={handlePizzaSave}>Save</button>
                                        <button onClick={handlePizzaEditCancel}>Cancel</button>
                                        </>
                                    ) : (
                                        <button onClick={() => handlePizzaEdit(pizza, index)}>Edit</button>
                                    )}
                                    </td>
                                    <td>
                                    <button
                                        onClick={() => {
                                        if (window.confirm('Are you sure you want to delete this pizza?')) {
                                            deletePizza(pizza);
                                        }
                                        }}
                                    >
                                        Delete
                                    </button>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
            {userType === 'storeOwner' && (
                <div id="update-toppings" className="container">
                    <h2>Toppings</h2>
                    {loading ? (
                        <p>Loading toppings...</p>
                    ) : toppings.length === 0 ? (
                        <center><p>No toppings available. Add some!</p></center>
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
                                {toppings.map((topping, index) => (
                                    <tr key={index} className="d-flex justify-content-between">
                                        <td>
                                            {editingToppingIndex === index ? (
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={editedTopping.name}
                                                    onChange={handleChange}
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
                                                    value={editedTopping.price}
                                                    onChange={handleChange}
                                                />
                                            ) : (
                                                `$${topping.price}`
                                            )}
                                        </td>
                                        <td>
                                            {editingToppingIndex === index ? (
                                                <button>Save</button>
                                            ) : (
                                                <button>Edit</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        <footer>
            <p>&copy; 2025 Pizza Store Management</p>
        </footer>

        <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.min.js"></script>
        </div>
    );
}
