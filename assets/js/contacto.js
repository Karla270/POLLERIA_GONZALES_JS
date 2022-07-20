const btn = document.getElementById('button');

document.getElementById('form')
    .addEventListener('submit', function (event) {
        event.preventDefault();

        btn.value = 'Enviando...';
        btn.disabled = true;

        const serviceID = 'default_service';
        const templateID = 'template_s45dsmg';

        //Correo que recibirá copia
        document.getElementById("cc").value = 'karla.gonz.27@gmail.com';

        emailjs.sendForm(serviceID, templateID, this)
            .then(() => {
                btn.disabled = false;
                btn.value = 'Enviar';
                document.getElementById('form').reset();
                mostrarAlerta('Correo enviado con éxito!', '#0062cc');
            }, (err) => {
                btn.disabled = false;
                btn.value = 'Enviar';
                mostrarAlerta('Ocurrió un error, volver a intentar!', 'orange');
            });
    });


