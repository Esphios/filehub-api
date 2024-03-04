import express from 'express';
import { json } from 'body-parser';
import { authorizeUserByToken } from './services/jwsServices';
import { 
  registerUserController, 
  loginUserController, 
  forgotPasswordController, 
  resetPasswordController, 
  grantFilePermissionController, 
  grantDirPermissionController
 } from './controllers/authController';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());

// Rota de testes
app.get('/', (req, res) => {
  res.send('FileHub API');
});

// Rotas de autenticação
app.post('/register', registerUserController);
app.post('/login', loginUserController);
app.post('/forgot-password', forgotPasswordController);
app.get('/reset-password', resetPasswordController);

app.post('/grant-file-permission', authorizeUserByToken, grantFilePermissionController);
app.post('/grant-directory-permission', authorizeUserByToken, grantDirPermissionController);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
