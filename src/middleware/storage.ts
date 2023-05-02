import multer from 'multer'

const storage = multer.diskStorage({
    
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

export const upload = multer({ storage: storage })

// export const uploadMiddleWare = (req, res, next) => {
//     upload.single('file')(req, res, err => {
//         if (err) {
//             return res.status(400).json({ error: 'Failed to upload file '})
//         }
//         next()
//     })
// }