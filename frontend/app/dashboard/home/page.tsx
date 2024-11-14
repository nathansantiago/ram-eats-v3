"use client"

import React, { useEffect, useState } from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"  
  
import { Card, CardContent } from "@/components/ui/card"

import axios from 'axios';
import { createClient } from "@/utils/supabase/client";
import { MealRecommendation, MealDetails, SelectedItem } from '@/app/models/models';

const HomePage: React.FC = () => {
    const supabase = createClient();
    const [mealRecommendations, setMealRecommendations] = useState<MealRecommendation>();

    useEffect(() => {
        const fetchMealRecommendations = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    throw new Error('User is not logged in.');
                }

                const user_id = session.user.id;

                const response = await axios.post('http://localhost:8000/recommendation/recommend-meal', {
                    user_id: user_id,
                });
                setMealRecommendations(response.data);
            } catch (error) {
                console.error('Error fetching meal recommendations:', error);
            }
        }
        fetchMealRecommendations();
    }, []);

    return (
        <>
            <Carousel 
                className="w-full max-w-xs"
                opts={{
                    align: "start",
                    loop: true,
                }}
            >
                <CarouselContent>
                    {mealRecommendations && Object.entries(mealRecommendations.meal_information).map(([mealName, mealDetails]: [string, MealDetails]) => (
                        <CarouselItem key={mealName}>
                            <div className="p-1">
                                <Card>
                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                        <div>
                                            <h3 className="text-2xl font-bold">{mealName}</h3>
                                            <div>
                                                {Object.entries(mealDetails.selected_items).map(([itemName, itemDetails]: [string, SelectedItem]) => (
                                                    <p key={itemName}><span className='font-semibold'>{itemName}:</span> {itemDetails.number_of_servings} servings</p>
                                                ))}
                                            </div>
                                            <div className='text-sm text-muted-foreground'>
                                            <p className="text-sm"><span className='font-bold'>Total Calories:</span> {mealDetails.total_calories}</p>
                                            <p className="text-sm"><span className='font-bold'>Total Protein:</span> {mealDetails.total_protein}g</p>
                                            <p className="text-sm"><span className='font-bold'>Total Carbs:</span> {mealDetails.total_carbs}g</p>
                                            <p className="text-sm"><span className='font-bold'>Total Fats:</span> {mealDetails.total_fats}g</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <div className='hidden sm:flex'>
                    <CarouselPrevious />
                    <CarouselNext />
                </div>
            </Carousel>
        </>
    );
};

export default HomePage;