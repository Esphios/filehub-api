import express from 'express';
import { json } from 'body-parser';
import authRoutes from './routes/authRoutes';
import fileRoutes from './routes/fileRoutes';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerJson from './swagger.json';

const app = express();

const options = {
  swaggerDefinition: swaggerJson,
  apis: ['**/*.ts'],
  securityDefinitions: {
    bearerAuth: {
      type: 'http',
      name: 'Authorization',
      scheme: 'bearer',
      in: 'header',
      bearerFormat: "JWT"
    },
  }
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT || 3000;
app.use(json());

app.use('/auth', authRoutes);
app.use('/files', fileRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});