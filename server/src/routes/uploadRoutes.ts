import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary";
console.log("✅ uploadRoutes loaded");

const router = express.Router();

/* -------------------- MULTER (MEMORY STORAGE) -------------------- */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ok =
      allowed.test(file.mimetype) &&
      allowed.test(file.originalname.toLowerCase());

    if (ok) cb(null, true);
    else cb(new Error("Only image files are allowed (jpeg, jpg, png, webp)."));
  },
});

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

/* -------------------- ROUTE -------------------- */
router.get("/test", (_req, res) => {
  res.send("UPLOAD ROUTE WORKS");
});

router.post(
  "/",
  upload.single("image"),
  async (req: MulterRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "ai-course-generator",
              resource_type: "image",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(req.file!.buffer);
      });

      res.status(200).json({
        imageUrl: result.secure_url,
        publicId: result.public_id,
      });
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      res.status(500).json({ message: "Image upload failed" });
    }
  }
);

export default router;
