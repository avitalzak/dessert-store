// import Dish from '../Models/dishes.model.js'

// const DishController = {

//     getDishes: async (req, res)=>{
//         try{
//             const dishes = await Dish.find({})
//             res.status(200).json(dishes)
//         }
//         catch(err){
//             res.status(500).json({error: err})
//         } 
        
//     },


//     deleteDish: async (req, res) => {
//           const id = req.params.id
    
//         try{
//             await Dish.findByIdAndDelete(id)
//             const dish = await Dish.find({})
//             res.json(dish)
//         }catch(err){
//             res.status(500).json({error: err})
//         }  
//     },



//     getDishById: async (req, res) => {
//       try {
//           const id = req.params.id;
//           const Dish = await Dish.findById(id)

//         if (!Dish) {
//             return res.status(404).json({ message: "Dish not found" })
//         }

//         res.status(200).json(Dish)
//         } catch (error) {
//             res.status(500).json({ error: error })
//         }
//     },

//     addDish: async (req, res)=>{
//         const {userId, name, base, toppings, syrups, priceTotal, image} = req.body
       
//         try{
//             const newDish = new Dish({
//             userId,
//             name, 
//             base, 
//             toppings,
//             syrups, 
//             priceTotal,
//             image
//         })
    
//         await newDish.save()
    
//         const dish = await Dish.find({})
//         res.status(200).json(dish)
    
//         }catch(err){
//             console.log(err)
//             res.status(500).json({error: err})
//         }
//     },

//     updateDish: async (req, res)=>{
//         const id = req.params.id
//         const {userId, name, base, toppings, syrups, priceTotal, image} = req.body
    
//         try{
//             const findDish = await Dish.findById(id)
    
//             if(!findDish){
//                 return res.status(404).json({message: "Dish not found"})
//             }

//             findDish.userId=userId
//             findDish.name=name
//             findDish.base=base
//             findDish.toppings=toppings
//             findDish.syrups=syrups
//             findDish.priceTotal=priceTotal
//             findDish.image=image
            
            
//             await findDish.save()
    
//             const update = await Dish.find({})
            
//             res.status(200).json(update)
//         }
//         catch(err){
//             res.status(500).json({error: err})
//         }
//     }

// }



// export default DishController;

