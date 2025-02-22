'use client';

import { useState, useEffect, use } from 'react';

export default function Home() {
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedPizza, setEditedPizza] = useState({});

    const handleEdit = (pizza, index) => {
        setEditedPizza({ //SET THE EDITED PIZZA TO THE SELECTED PIZZA
            id: pizza.id,
            name: pizza.name,
            price: pizza.price,
            toppings: [...pizza.toppings],
        });
        setEditingIndex(index);
    };

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        let value_as_number = Number(value); //CONVERT STRING VALUE TO NUMBER (MUST BE DONE AS LIMITATION OF CHECKBOXES)

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
    };
    

    const handleCancel = () => {
        setEditingIndex(null);
        setEditedPizza({});
    };

    //HANDLE SAVE FUNCTION (PUT REQUEST TO UPDATE PIZZA)
    const handleSave = async () => {
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
                        index === editingIndex ? editedPizza : p
                    )
                );
            } 
            else {
                console.error("Failed to update pizza:", data.message || "Unknown error");
            }
        } catch (error) {
            console.error("Error updating pizza:", error);
        }
        setEditingIndex(null);
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
            } else {
                console.error("Failed to delete pizza:", data.message || "Unknown error");
            }
        } catch (error) {
            console.error("Error deleting pizza:", error);
        }
    };
    

    return (
        <div>
            <center>
                <header>
                    <h1>Chef Portal</h1>
                </header>
            </center>

            <div className="container">
                <div className="button-row">
                    <button className="btn" onClick={() => showSection('update-toppings')}>Update Toppings</button>
                </div>
            </div>

            {currentSection === 'view-pizzas' && (
                <div id="view-pizzas" className="container">
                    {loading ? (
                        <p>Loading pizzas...</p>
                    ) : pizzas.length === 0 ? (
                        <center><p>No pizzas available. Add some!</p></center>
                    ) : (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Toppings</th>
                                    <th></th>
                                    <th style={{ textAlign: 'right' }}>
                                        <button className="sml-btn" onClick={() => {/* Add functionality here */}}>
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {pizzas.map((pizza, index) => (
                                <tr key={index} className="d-flex justify-content-between">
                                    <td>
                                    {editingIndex === index ? (
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
                                    {editingIndex === index ? (
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
                                        {editingIndex === index ? (
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
                                    {editingIndex === index ? (
                                        <>
                                        <button onClick={handleSave}>Save</button>
                                        <button onClick={handleCancel}>Cancel</button>
                                        </>
                                    ) : (
                                        <button onClick={() => handleEdit(pizza, index)}>Edit</button>
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
                    
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <center></center>
                    </div>
                </div>
            )}

            {/* Section for Updating Toppings */}
            {currentSection === 'update-toppings' && (
                <div id="update-toppings" className = "container d-flex justify-content-center align-items-center">
                <h2>Update Toppings</h2>
                <p>Modify the toppings on existing pizzas.</p>
                <button className="btn btn-success">Update Toppings</button>
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
