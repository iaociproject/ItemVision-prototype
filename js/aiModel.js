// More API functions here:
    // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

    // the link to your model provided by Teachable Machine export panel
    const URL = "https://teachablemachine.withgoogle.com/models/xFEEk_943/";

    let model, webcam, labelContainer, maxPredictions;

    // Load the image model and setup the webcam
    async function init() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        try {


            // load the model and metadata
            // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
            // or files from your local hard drive
            // Note: the pose library adds "tmImage" object to your window (window.tmImage)
            model = await tmImage.load(modelURL, metadataURL);
            maxPredictions = model.getTotalClasses();

            // Convenience function to setup a webcam
            const flip = true; // whether to flip the webcam
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            const width = isMobile ? 200 : 300;
            const height = isMobile ? 200 : 300;
            webcam = new tmImage.Webcam(width, height, flip);
            await webcam.setup(); // request access to the webcam
            await webcam.play();
            window.requestAnimationFrame(loop);

            // append elements to the DOM
            document.getElementById("webcam-container").appendChild(webcam.canvas);
            labelContainer = document.getElementById("label-container");
            for (let i = 0; i < maxPredictions; i++) { // and class labels
                labelContainer.appendChild(document.createElement("div"));
            }
        } catch (error) {
            console.error("Error al acceder a la cámara:", error);
            alert("No se pudo acceder a la cámara. Detalles: " + error.message);
        }
    }

    async function loop() {
        webcam.update(); // update the webcam frame
        await predict();
        window.requestAnimationFrame(loop);
    }

    // run the webcam image through the image model
    async function predict() {
    const prediction = await model.predict(webcam.canvas);

    let highest = prediction.reduce((prev, current) =>
        (prev.probability > current.probability) ? prev : current
    );

    labelContainer.innerHTML = 
        "Producto detectado: " + highest.className + 
        " (" + highest.probability.toFixed(2) + ")";

    mostrarInformacion(highest.className);
    }
    function mostrarInformacion(producto) {
    let info = "";

    if(producto === "Tuny Agua 270g") {
        info = `
        <h2>Atún en Agua Tuny 270g</h2>
        <p>HS: 1604.14</p>
        <p>Sector: Industria alimentaria</p>
        <p>Regulación: COFEPRIS</p>
        <p>Transporte sugerido: Marítimo</p>
        <p>Tratado aplicable: TMEC</p>
        `;
    }

    if(producto === "Great value Tomate M. Condimentado 210g") {
        info = `
        <h2>Tomates Molidos Great Value 210g</h2>
        <p>HS: 2002.90</p>
        <p>Sector: Agroalimentario</p>
        <p>Regulación: COFEPRIS</p>
        <p>Transporte sugerido: Marítimo</p>
        <p>Tratado aplicable: TMEC</p>
        `;
    }

    document.getElementById("info-producto").innerHTML = info;
}
