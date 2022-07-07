const express = require('express');
const router = express.Router();
const { Category } = require('../models/category');
const {Product} = require('../models/product')
const mongoose = require('mongoose');
const multer = require ('multer');


const FILE_TYPE_MAP ={
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid= FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');
      if(isValid) {
          uploadError = null
      }
      cb(uploadError , '/public/uploads')
    },
    filename: function (req, file, cb) {
        
      const fileName = file.originalname.split('').join('-');
      const extension = FILE_TYPE_MAP[file.mimetype];
      
      cb(null, `${fileName}-{Date.now()}.${extension}`)
    }
  })
  
  const uploadOptions = multer({ storage: storage })


router.get(`/`, async (req, res)=>{
    let filter = {};
    if(req.query.categories)
    {
       filter = {category: req.query.categories.split(',')}
    }
    const productList = await Product.find({filter}).populate('category');

    if(!productList){
        res.status(500).json({success:false})
    }
    res.send(productList);  
})

//getting one item and maybe filter by id name or category
router.get(`/:id`, async (req, res)=> {
    const product = await (await Product.findById(req.params.id)).populate('category');
       if (!product){
           res.status(500).json({success:false})
       }

       res.send(product);
})

// router.post(`/`, (req, res)=> {
//     const product = new Product({
//         name:req.body.name,
//         image:req.body.image,
//         countInStock:req.body.countInStock,
//     })

//     product.save().then((createdProduct=> {
//         res.status(201).json(createdProduct)
//     })).catch((err)=>{
//         res.status(500).json({
//             error:err,
//             success: false
//         })
//     })
// })

//adding products to categories
router.post(`/`,  uploadOptions.single('image'), async(req, res)=> {
    const category  = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid category')

    const file = req.file;
    if(!file) return res.status(400).send('no image file in this request')
    const fileName = req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    let product = new Product ({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: `${basePath}${fileName}`, //"http://localhost:4200/public/uploads/image-2323232"
    brand :req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews:req.body.numReviews,
    isFeatured: req.body.isFeatured,
})
  Product = await product.save();

 if(!product) 
 return res.status(500).send('The product cannot be created')

   res.send(product);  
})

router.put('/:id', uploadOptions.single('image'), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id');
    }
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(400).send('Invalid Product!');

    const file = req.file;
    let imagepath;

    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagepath = `${basePath}${fileName}`;
    } else {
        imagepath = product.image;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: imagepath,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured
        },
        { new: true }
    );

    if (!updatedProduct) return res.status(500).send('the product cannot be updated!');

    res.send(updatedProduct);
});
    
   

 router.delete('/:id', (req, res)=> {

    Product.findByIdAndDelete(req.params.id).then(product => {
        if (product) {
        return res.status(200).json({success: true, message: 'the product has been deleted'})
    }
else {
    return res.status(404).json({success: false, message: "product not found"})
}
    }).catch(err=> {
        return res.status(400).json({success: false, error: err})
    })
})


//COUNT OF TOTAL PRODUCTS AND PRICE AND SALES
router.get(`/get/count`, async (req, res)=> {
    const productCount = await Product.countDocuments()
       if(!productCount){
           res.status(500).json({success:false})
       }
       res.send({count: productCount});
})


//filteringfeatured products and reducing the number on display
router.get(`/get/featured/:count`, async (req, res)=> {
    const count =req.params.count ? request.params.count : 0
    const products= await Product.find({isFeatured: true}).limit(+count);
       if(!products){
           res.status(500).json({success:false})
       }
       res.send({count: products});
})

router.put('/gallery-images/:id', uploadOptions.array('images', 10), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id');
    }
    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    if (files) {
        files.map((file) => {
            imagesPaths.push(`${basePath}${file.filename}`);
        });
    }

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            images: imagesPaths
        },
        { new: true }
    );

    if (!product) return res.status(500).send('the gallery cannot be updated!');

    res.send(product);
});





module.exports  = router;

