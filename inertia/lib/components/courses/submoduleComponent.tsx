import { motion } from 'framer-motion';
import { Icons } from '~/lib/components/icons';

interface SubModuleComponentProps {
    submodule: any;
    subIndex: number;
}

const SubModuleComponent: React.FC<SubModuleComponentProps> = ({ submodule, subIndex }) => {
    return (
        <motion.div
            className="flex flex-col justify-between items-center bg-gray-50 rounded-md md:flex-row md:p-3"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: subIndex * 0.1 }}
        >
            <div className="flex items-center space-x-3">
                {submodule.isCompleted ? (
                    <Icons.checkCircle className="w-5 h-5" />
                ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                )}
                <div>
                    <h3 className="font-medium">{submodule.title}</h3>
                    <p className="text-sm text-gray-600">{submodule.description}</p>
                </div>
            </div>
            {submodule.contentCreated ? (
                ""
            ) : (
                <p className="flex gap-2 items-center px-3 py-1 text-sm font-medium rounded-full text-muted-foreground bg-muted">
                    <Icons.loader className="w-4 h-4 animate-spin" />
                </p>
            )}
        </motion.div>
    );
};

export default SubModuleComponent;
