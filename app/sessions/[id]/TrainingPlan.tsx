"use client"

import { useState } from "react";
import clsx from "clsx";
import styles from "@/app/styles";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import type { TrainingPlan } from "@prisma/client";


export default function TrainingPlan({ props }: { props: TrainingPlan }) {
    const [selected, setSelected] = useState("");

    function sectionComponent({ title, content, keyword, color }: { title: string, content?: string, keyword: string, color: string }) {
        const isSelected = selected === keyword;
        return (
            <button
                className={clsx('flex flex-col border-2 py-4 px-5 rounded-xl max-w-screen-lg', {
                    'border-blue-500': color === 'blue-500',
                    'border-green-500': color === 'green-500',
                    'border-orange-500': color === 'orange-500',
                    'border-red-500': color === 'red-500',
                })}
                onClick={() => isSelected ? setSelected("") : setSelected(keyword)}
            >
                <div className="flex justify-between w-full">
                    <span className={`${styles.heading3} font-bold`}>{title.toUpperCase()}</span>
                    <ChevronDownIcon
                        className={clsx(
                            'w-6 h-6 transform transition-transform duration-300',
                            isSelected ? 'rotate-180' : 'rotate-0'
                        )}
                    />
                </div>
                <div
                    className={clsx(
                        'transition-all duration-300 ease-in-out text-left',
                        isSelected ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    )}
                    style={{
                        transitionProperty: 'max-height, opacity',
                    }}
                >
                    <span className={`${styles.paragraph}`}>{content}</span>
                </div>
            </button>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center">
                <span className={`${styles.heading2} font-bold`}>TRAINING PLAN</span>
            </div>
            <div className="flex flex-col gap-4">

                {/* General Plan */}
                {props.generalPlan ? sectionComponent({ title: "General", content: props.generalPlan, keyword: "general", color: "blue-500" }) : null}

                {/* Beginner Plan */}
                {props.beginnerPlan ? sectionComponent({ title: "Beginner program", content: props.beginnerPlan, keyword: "beginner", color: "green-500" }) : null}

                {/* Intermediate Plan */}
                {props.intermediatePlan ? sectionComponent({ title: "Intermediate program", content: props.intermediatePlan, keyword: "intermediate", color: "orange-500" }) : null}

                {/* Advanced Plan */}
                {props.advancedPlan ? sectionComponent({ title: "Advanced program", content: props.advancedPlan, keyword: "advanced", color: "red-500" }) : null}
            </div>
        </div>
    );
}