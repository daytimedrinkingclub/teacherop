import { useEffect, useState } from 'react';
import { Icons } from '~/lib/components/icons';
import { Card, } from '~/lib/components/ui/card';
import { buttonVariants } from '~/lib/components/ui/button';
import { Progress } from '~/lib/components/ui/progress';
import { calculatePercentage, cn } from '~/lib/lib/utils';
import ModuleComponent from './moduleComponent';
import { Link, router } from '@inertiajs/react';
import BreadcrumbNav from '../bedcrumLinks';

interface CourseComponentProps {
    course: any;
    modules: any[];
}

const CourseComponent: React.FC<CourseComponentProps> = ({ course, modules }) => {
    const [showFullDescription, setShowFullDescription] = useState(false);

    const breadcrumbLinks = [
        { name: 'Home', href: '/' },
        { name: 'Course', href: `/courses/${course.id}` },
    ]

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };


    // useEffect(() => {
    //     if (!course.isModulesCreated) {
    //         const interval = setInterval(() => {
    //             router.reload();
    //         }, 5000);
    //         return () => clearInterval(interval);
    //     }
    // }, [course.isModulesCreated]);

    return (
        <>
            <div className="container p-2 mx-auto space-y-6 rounded-lg md:p-4">
                <BreadcrumbNav links={breadcrumbLinks} />
                <div className="flex gap-4 items-center mb-6">
                    <h1 className="text-lg font-bold md:text-3xl">{course.title}</h1>
                    {!course.isModulesCreated && (
                        <p className="flex gap-2 items-center px-3 py-1 text-sm font-medium rounded-full text-muted-foreground bg-muted">
                            <Icons.loader className="w-4 h-4 animate-spin" />
                            <span className="hidden md:inline"> Creating modules...</span>
                        </p>
                    )}
                </div>

                <Card className="p-6 rounded-lg shadow-lg bg-background">
                    <div className="mb-4">
                        <p className={`text-gray-700 ${!showFullDescription && 'md:block hidden'}`}>
                            {course.description}
                        </p>
                        <p
                            className={`text-gray-700 md:hidden ${showFullDescription ? 'block' : 'line-clamp-3'}`}
                        >
                            {course.description}
                        </p>
                        <button
                            onClick={toggleDescription}
                            className="mt-2 text-sm text-blue-600 hover:underline md:hidden"
                        >
                            {showFullDescription ? 'Show Less' : 'Show More'}
                        </button>
                    </div>

                    <div className="flex items-center space-x-4 whitespace-nowrap">
                        <Progress
                            value={(course.completedModule / course.totalModule) * 100}
                            className="flex-grow"
                        />
                        <p className="flex items-center text-sm text-gray-500">
                            <Icons.clock className="mr-1 w-4 h-4" />
                            <span>
                                {course.completedModule} / {course.totalModule} Modules
                            </span>
                        </p>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                        {calculatePercentage(course.totalModule, course.completedModule || 0)}% Complete
                    </p>

                    {/* Start Course Button */}
                    <div className="mt-4 flex justify-end">
                        <Link href={`/modules/${modules[0].id}`} className={cn(buttonVariants({ variant: "default" }))}>
                            Explore Course
                            <Icons.chevronRight className="ml-2 w-4 h-4" />
                        </Link>
                    </div>
                </Card>

                {modules.map((module, index) => (
                    <ModuleComponent key={module.id} module={module} index={index} />
                ))}
            </div>
        </>
    );
};

export default CourseComponent;
