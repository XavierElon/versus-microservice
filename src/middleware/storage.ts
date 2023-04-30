import multer from 'multer'

const storage = multer.diskStorage({
    
    destination: function (req, file, cb) {
        console.log('dest')
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        console.log('filename')
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })

export const uploadMiddleWare = (req, res, next) => {
    upload.single('file')(req, res, err => {
        if (err) {
            return res.status(400).json({ error: 'Failed to upload file '})
        }
        next()
    })
}