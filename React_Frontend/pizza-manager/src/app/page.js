'use client';

import { useState, useEffect, use } from 'react';

export default function Home() {
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
                    
                    for (let i = 0; i < data.pizzas.length; i++) {
                        data.pizzas[i].toppings = data.pizzas[i].toppings.map(id => {
                            const topping = toppings.find(topping => topping.id === id);
                            return topping ? topping.name : 'Unregistered Topping';
                        });
                    }
    
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
                                    <tr key={index} className = "d-flex justify-content-between">
                                        <td>{pizza.name}</td>
                                        <td>${pizza.price}</td>
                                        <td>{pizza.toppings.join(', ')}</td>
                                        <td><button>Edit</button></td>
                                        <td><button onClick={() => {
                                            if (window.confirm('Are you sure you want to delete this pizza?')) {
                                                deletePizza(pizza);
                                            }
                                        }
                                        }>Delete</button></td>
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
