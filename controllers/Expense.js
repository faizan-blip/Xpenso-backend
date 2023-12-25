const AuthSchema = require('../models/AuthSchema');
const budgetschema = require('../models/budgetschema');
const ExpenseSchema = require('../models/expenseschema');
const mailsender = require('./mailsender');

 exports.calculateTotalExpense = async (req , res) => {
  try {
    const userToken = req.headers.authorization.split(' ')[1];
    const expenses = await ExpenseSchema.find({userToken});
    const auth = await AuthSchema.find();
    console.log(auth);    
    const totalExpense = expenses.reduce((acc, expense) => {
      if (expense.value !== undefined) {
        return acc + expense.value;
      } else {
        return acc;
      }
    }, 0);
    const overallBudgetData = await budgetschema.find({userToken});
    // console.log(overallBudgetData);
    const overallBudget = overallBudgetData.reduce((acc, budget) => acc + budget.value, 0);

    console.log('Total Expense:', totalExpense);
    console.log('Overall Budget:', overallBudget);
   res.status(201).json({
    success: true,
        data: {totalExpense,overallBudget},
        message: "Total Expense Calculated",
   })
    if (totalExpense > overallBudget) {

      const authEmail = auth[auth.length - 1]?.email;
   console.log(authEmail,auth.length);
      await mailsender(totalExpense, overallBudget, authEmail);
      res.status(201).json({
        success: true,
        data: {totalExpense,overallBudget},
        message: "Expense got to peak",
      });
    }

    
    return totalExpense;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

// exports.createCategory = async (req, res) => {
//     try {
//       const { value, label } = req.body;
//       const category = await ExpenseSchema.create({ value, label });
  
//       res.status(201).json({
//         success: true,
//         data: category,
//         message: "Category created successfully",
//       });
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).json({
//         success: false,
//         message: "Error in creating a category",
//       });
//     }
//   };
  
  // Get all categories
  
// exports.createCategory = async (req, res) => {
//   try {
//     const { value, label } = req.body;
//     const userToken = req.headers.authorization.split(' ')[1];
//     const category = await ExpenseSchema.create({ value, label, userToken });

//     res.status(201).json({
//       success: true,
//       data: category,
//       message: "Category created successfully",
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({
//       success: false,
//       message: "Error in creating a category",
//     });
//   }
// };

// exports.getCategory = async (req, res) => {
//   try {
//     const userToken = req.headers.authorization.split(' ')[1];
//     const categories = await ExpenseSchema.find({ userToken });

//     res.status(200).json({
//       success: true,
//       data: categories,
//       message: "All categories retrieved successfully",
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({
//       success: false,
//       message: "Error in getting categories",
//     });
//   }
// };

// exports.deleteCategory = async (req, res) => {
//   try {
//     const userToken = req.headers.authorization.split(' ')[1];
//     const id = req.params.id;
//     const deletedCategory = await ExpenseSchema.findByIdAndDelete({ _id: id, userToken });

//     if (!deletedCategory) {
//       return res.status(404).json({
//         success: false,
//         message: "Category not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: deletedCategory,
//       message: "Category deleted successfully",
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({
//       success: false,
//       message: "Error in deleting a category",
//     });
//   }
// };

exports.createBudget = async (req, res) => {
  try {
    const { value } = req.body;
    const userToken = req.headers.authorization.split(' ')[1];
    const createdBudget = await budgetschema.create({ value, userToken, createdAt: Date.now() });

    res.status(201).json({
      success: true,
      data: createdBudget,
      message: "Budget for the month created successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Error in creating a budget",
    });
  }
};

exports.updateBudget = async (req, res) => {
  try {
    const userToken = req.headers.authorization.split(' ')[1];
    const { id } = req.params;
    const { value } = req.body;
    const updatedBudget = await budgetschema.findByIdAndUpdate(
      { _id: id, userToken },
      { value, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedBudget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found or not updated",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedBudget,
      message: "Budget updated successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Error in updating a budget",
    });
  }
};

exports.getBudget = async (req, res) => {
  try {
    const userToken = req.headers.authorization.split(' ')[1];
    const budgetData = await budgetschema.find({ userToken });

    if (!budgetData) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    res.status(200).json({
      success: true,
      data: budgetData,
      message: "Budget retrieved successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Error in getting a budget",
    });
  }
};

exports.createExpense = async (req, res) => {
  try {
    const { value, label } = req.body;
    const userToken = req.headers.authorization.split(' ')[1];
    const expense = await ExpenseSchema.create({ value, label, userToken });

    res.status(201).json({
      success: true,
      data: expense,
      message: "Expense created successfully",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      success: false,
      message: "Error in creating an expense",
    });
  }
};

exports.editExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { value, label } = req.body;
    const userToken = req.headers.authorization.split(' ')[1];
    const updatedExpense = await ExpenseSchema.findByIdAndUpdate(
      { _id: id, userToken },
      { value, label, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found or not updated",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedExpense,
      message: "Expense updated successfully",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      success: false,
      message: "Error in updating an expense",
    });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userToken = req.headers.authorization.split(' ')[1];
    const deletedExpense = await ExpenseSchema.findByIdAndDelete({ _id: id, userToken });

    if (!deletedExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      data: deletedExpense,
      message: "Expense deleted successfully",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      success: false,
      message: "Error in deleting an expense",
    });
  }
};

exports.getExpense = async (req, res) => {
  try {
    const userToken = req.headers.authorization.split(' ')[1];
    const expenses = await ExpenseSchema.find({ userToken });

    res.status(200).json({
      success: true,
      data: expenses,
      message: "Expense got successfully",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      success: false,
      message: "Error in getting expense",
    });
  }
};