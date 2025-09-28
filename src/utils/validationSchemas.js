export const createUserValidationSchema = {
    user:{
        isLength: {
            options:{
                min:5,
                max:32
            },
            errorMessage:"must be between 5 and 20 characters",
        },
        notEmpty: true,
        isString: true,
    },
    displayName:{
        notEmpty:true,
    }
}