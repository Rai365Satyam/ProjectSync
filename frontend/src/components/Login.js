import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function Login() {
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isSignup) {
                // Call backend signup API
                await axios.post("http://localhost:9005/signup", formData);
                toast.success("Account created! Please log in.");
                setIsSignup(false);
            } else {
                // Call backend login API
                const { data } = await axios.post("http://localhost:9005/login", {
                    email: formData.email,
                    password: formData.password,
                });
                // Store the token and user data in local storage
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.result));
                toast.success(`Welcome back, ${data.result.name}!`);
                window.location.reload(); // Refresh to trigger route guard check
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Something went wrong";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-md">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        {isSignup ? "Create your account" : "Sign in to your account"}
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="-space-y-px rounded-md shadow-sm">
                        {isSignup && (
                            <div className="mb-3">
                                <label className="text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="relative block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                        <div className="mb-3">
                            <label className="text-sm font-medium text-gray-700">Email address</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="relative block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                className="relative block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400"
                        >
                            {loading ? "Processing..." : isSignup ? "Sign Up" : "Sign In"}
                        </button>
                    </div>
                </form>
                <div className="text-center text-sm">
                    <button
                        onClick={() => setIsSignup(!isSignup)}
                        className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
                    >
                        {isSignup ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;