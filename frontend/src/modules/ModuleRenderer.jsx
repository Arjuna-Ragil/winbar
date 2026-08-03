import YamwModule from './yamw/YamwModule';
import Notepad from './notepad/Notepad';

const ModuleRenderer = ({ name }) => {
    switch (name) {
        case 'yamw':
            return <YamwModule />;
        case 'notepad':
            return <Notepad />;
        // Future modules can be added here
        default:
            return <div className="p-4 bg-red-500/20 text-red-200 rounded">Unknown module: {name}</div>;
    }
};

export default ModuleRenderer;
