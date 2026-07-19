import express from "express";
import upload from "../upload.js";
import cloudinary from "../cloudinary.js";

const router = express.Router();


router.post("/", upload.single("image"), async (req, res) => {

    try {

        const result = await new Promise((resolve, reject) => {

            cloudinary.uploader.upload_stream(
                { folder: "desserts" },
                (error, result) => {

                    if (error) {
                        reject(error);
                    }

                    else {
                        resolve(result);
                    }
                }
            ).end(req.file.buffer);

        });


        res.json({
            message: "image uploaded successfully",
            imageUrl: result.secure_url
        });


    } catch (error) {

        console.log(error);
        res.status(500).json({
            message: "upload failed"
        });

    }

});


export default router;