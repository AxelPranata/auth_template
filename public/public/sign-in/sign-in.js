document.addEventListener("DOMContentLoaded", (e) => {
    const signIn = document.getElementById("sign-in");
    signIn.addEventListener("click", handleSignIn);
})

async function handleSignIn(e) {
    e.preventDefault();

    let emailVal = document.getElementById("email").value;
    let passwordVal = document.getElementById("password").value;

    try {
        const response = await fetch("/auth/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: emailVal,
                password: passwordVal
            }),
        });

        // If user is authenticated, redirect to main page
        if (response.ok) {
            window.alert("Success");
            window.location.href = "/protected/";
        }
        else {
            window.alert("Fail");
        }
    }
    catch (error) {
        console.error(`Error signing in user: ${error}`);
    }
}
    