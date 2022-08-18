fetch(`http://localhost:8080/mokepon/${jugadorId}`, {
    method: "post",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        mokepon: mascotaJugador
    })
})