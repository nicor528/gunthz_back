const sharp = require('sharp');

// Función para reducir el tamaño de una imagen en base64
async function reducirTamanioImagen(base64Image, calidad = 70) {
  try {
    // Decodificar la imagen base64
    const buffer = Buffer.from(base64Image, 'base64');

    // Reducir el tamaño de la imagen con sharp
    const resultadoBuffer = await sharp(buffer)
      .jpeg({ quality: calidad })
      .toBuffer();

    // Convertir el buffer resultante a cadena base64
    const base64ImagenReducida = resultadoBuffer.toString('base64');

    console.log('Imagen reducida exitosamente.');
    
    return base64ImagenReducida;
  } catch (error) {
    console.error('Error al reducir el tamaño de la imagen:', error);
    throw error;
  }
}

// Ejemplo de uso
/*
const base64ImagenOriginal = '...'; // Tu cadena base64 aquí

reducirTamanioImagen(base64ImagenOriginal)
  .then(base64ImagenReducida => {
    // Aquí puedes utilizar la cadena base64 de la imagen reducida
    console.log('Base64 de la imagen reducida:', base64ImagenReducida);
    
    // Puedes almacenar la cadena base64 en tu EC2 según tus necesidades
    // Por ejemplo, podrías enviarla a través de una solicitud HTTP o almacenarla en una base de datos.
  })
  .catch(error => {
    // Manejo de errores
    console.error('Error:', error);
  });*/

module.exports = {
    reducirTamanioImagen
}