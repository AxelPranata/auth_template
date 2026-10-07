document.addEventListener("DOMContentLoaded", (e) => {
    const signOut = document.getElementById("sign-out");
    signOut.addEventListener("click", handleSignOut);
})

async function handleSignOut(e) {
    e.preventDefault();

    try {
        const response = await fetch("/auth/signout");

        const responseBody = await response.json();

        // If user successfully logs out, redirect to sign in page
        if (response.ok) {
            window.alert("Success");
            window.location.href = "/public/sign-in";
        }
        else {
            window.alert("Fail");
        }

    }
    catch (error) {
        console.error(`Error signing out user: ${error}`);
    }
}
    