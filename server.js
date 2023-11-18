import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import express from 'express';
import { body, validationResult } from 'express-validator';

const app = express()


const prisma = new PrismaClient();

app.use(express.json());

const PORT = process.env.PORT || 3000;

 

// Read the data 
app.get("/", async(req, res)=>{
     const allUsers = await prisma.user.findMany();
     res.json(allUsers);
});


// Create the data 
app.post("/",body('FirstName').isLength({min : 3}),body('LastName').isLength({max: 2}) , async(req, res)=>{
     const errors = validationResult(req);
     if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
     }
    const newUser = await prisma.user.create({data: req.body});
    res.json(newUser);
     
});


// Update the data
app.put("/:id", async(req, res)=>{
    const id = parseInt(req.params.id);
    const newAge = parseInt(req.body.Age);
    const UpdateUser = await prisma.user.update({
        where:{Id: id},
        data:{Age: newAge},
    });
    res.json(UpdateUser);
});


// Delete the Data
app.delete("/:id", async(req, res)=>{
    const id = req.params.id;
    const deletedUser = await prisma.user.delete({
        where:{Id: parseInt(id)},
    });
    res.json(deletedUser);
});

app.listen(PORT,()=> console.log(`Server is runing on Port: ${PORT}`))