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

import { LoaderCircle } from "lucide-react"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"
import {
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const chartData = [
  { browser: "safari", visitors: 1300, fill: "var(--color-safari)" },
]

const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    safari: {
      label: "Safari",
      color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

const HomePage: React.FC = () => {
    const supabase = createClient();
    const router = useRouter();
    const [mealRecommendations, setMealRecommendations] = useState<MealRecommendation>();
    const [loading, setLoading] = useState<boolean>(true);

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
                setLoading(false);
            } catch(error: any) {
                toast({
                  variant: "destructive",
                  title: "Error",
                  description: error.message,
                });
                router.push('/');
            }
        }
        fetchMealRecommendations();
    }, []);

    return (
        loading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : (
        <div className='flex flex-col items-center'>
            <Card className="flex flex-col max-w-sm w-full">
                <CardHeader className="items-center pb-0">
                    <CardTitle className='text-2xl font-bold'>Today's Calorie Goal</CardTitle>
                    <CardDescription>November 11th 2024</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                    <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                    >
                    <RadialBarChart
                        data={chartData}
                        startAngle={0}
                        endAngle={chartData[0].visitors/2000*360}
                        innerRadius={80}
                        outerRadius={110}
                    >
                        <PolarGrid
                        gridType="circle"
                        radialLines={false}
                        stroke="none"
                        className="first:fill-muted last:fill-background"
                        polarRadius={[86, 74]}
                        />
                        <RadialBar dataKey="visitors" background cornerRadius={10} />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                        <Label
                            content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                return (
                                <text
                                    x={viewBox.cx}
                                    y={viewBox.cy}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                >
                                    <tspan
                                    x={viewBox.cx}
                                    y={viewBox.cy}
                                    className="fill-foreground text-4xl font-bold"
                                    >
                                    {chartData[0].visitors.toLocaleString()}
                                    </tspan>
                                    <tspan
                                    x={viewBox.cx}
                                    y={(viewBox.cy || 0) + 24}
                                    className="fill-muted-foreground"
                                    >
                                    Calories
                                    </tspan>
                                </text>
                                )
                            }
                            }}
                        />
                        </PolarRadiusAxis>
                    </RadialBarChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2 font-medium leading-none">
                    Today's Calorie Goal: 2000
                    </div>
                </CardFooter>
            </Card>

            <Carousel 
                className="max-w-sm w-full"
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
        </div>
    ));
};

export default HomePage;