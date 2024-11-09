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
import { supabase } from "@/lib/supabase";

const HomePage: React.FC = () => {
    const [mealRecommendations, setMealRecommendations] = useState<any>(null);

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
                    {/* TODO: Add carousel items */}
                    {mealRecommendations ? Array.from(mealRecommendations).map((_, index) => (
                    <CarouselItem key={index}>
                        <div className="p-1">
                        <Card>
                            <CardContent className="flex aspect-square items-center justify-center p-6">
                            <span className="text-4xl font-semibold">{mealRecommendations[index]}</span>
                            </CardContent>
                        </Card>
                        </div>
                    </CarouselItem>
                    )): null}
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