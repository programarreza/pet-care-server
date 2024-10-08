import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join((process.cwd(), ".env")) });

export default {
  port: process.env.PORT,
  database_url: process.env.MONGODB_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS || 10,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  NODE_ENV: process.env.NODE_ENV,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  payment_url: process.env.PAYMENT_URL,
  store_id: process.env.STORE_ID,
  signature_key: process.env.SIGNATURE_KEY,
  base_url: process.env.BASE_URL,
  client_url: process.env.CLIENT_URL,
  payment_verify_url: process.env.PAYMENT_VERIFY_URL,
  reset_password_ui_link: process.env.RESET_PASSWORD_UI_LINK,
};
