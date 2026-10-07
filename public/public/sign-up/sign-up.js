document.addEventListener("DOMContentLoaded", (e) => {
    const signUp = document.getElementById("sign-up");
    signUp.addEventListener("click", handleSignUp);
})

async function handleSignUp(e) {
    e.preventDefault()

    const usernameVal = document.getElementById("username").value;
    const emailVal = document.getElementById("email").value;
    const passwordVal = document.getElementById("password").value;

    try {
        const response = await fetch("/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: usernameVal,
                email: emailVal,
                password: passwordVal
            }),
        });

        let responseBody = await response.json();

        // If user is valid, redirect to another page
        if (response.ok) {
            window.alert(responseBody.message);
            window.location.href = "/protected";
        }
        else {
            window.alert(responseBody.message);
        }

    }
    catch (error) {
        console.error(`Error signing up user: ${error}`);
    }
}