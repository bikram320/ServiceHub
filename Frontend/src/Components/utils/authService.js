

export const loginUser = async (data, role) => {
    const response = await fetch(`http://localhost:8080/auth/login/${role}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include"
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Login failed");
    }

    return await response.json(); // if backend returns user info
};
