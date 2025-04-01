import React from "react";
interface MealPlanInput{
    dietType: string;
    calories: number;
    allergies: string;
    cuisine: string;
    snack: string;
    days?: number;    
}

export default function MealPlanDashboard(){
    function handleSubmit(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const payload : MealPlanInput = {
            dietType: formData.get("dietType")?.toString() || "",
            calories: Number(formData.get("calories")) || 2000,
            allergies: formData.get("allergies")?.toString() || "",
            cuisine: formData.get("cuisine")?.toString() || "",
            snack: formData.get("snack")?.toString() || "",
            days: 7,
        };
    }
    return (
    <div> 
        <div>
             <div>
                <h1> AI Meal Plan Generator</h1>
                <form>
                    <div>
                        <label htmlFor="dietType"> Diet Type</label>
                        <input 
                            type="text" 
                            id="dietType"
                            name="dietType"
                            required 
                            placeholder = "e.g. Vegetarian, Vegan, Keto, Mediterranean..."
                        />
                    </div>

                    <div>
                        <label htmlFor="calories"> Daily Calorie Goal</label>
                        <input 
                            type="number" 
                            id="calories" 
                            name="dietType"
                            required 
                            min={500}
                            max={15000}
                            placeholder = "e.g. 2000"
                        />
                    </div>

                    <div>
                        <label htmlFor="allergies"> Daily Calorie Goal</label>
                        <input 
                            type="text" 
                            id="allergies"
                            name="dietType" 
                            required 
                            placeholder = "e.g. Nuts, Dairy, None..."
                        />
                    </div>
                    <div>
                        <label htmlFor="cuisine"> Preferred Cuisine</label>
                        <input 
                            type="text" 
                            id="cuisine"
                            name="dietType"
                            required 
                            placeholder = "e.g. Italian, Chinese, Persian, No Preference..."
                        />
                    </div>

                    <div>
                        <input 
                            type="checkbox" 
                            id="snacks" 
                            name="dietType"
                        />
                        <label htmlFor="snacks"> Include Snacks</label>
                    </div>
                    <div><button type="submit"> Generate Mean Plan </button></div>
                </form>
            </div>
            <div>
                <h2>
                    Weekly Meal Plan
                </h2>
            </div>
        </div>
    </div>
    );
}