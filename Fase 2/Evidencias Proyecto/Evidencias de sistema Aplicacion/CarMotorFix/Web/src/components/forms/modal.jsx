import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDarkModeFromLocalCookie } from '../../lib/cookies';
import Spinner from '../../components/animation/spinner'; // Import Spinner component

const Modal = ({ isOpen, onClose, children, loading = false }) => {
    const darkMode = getDarkModeFromLocalCookie();

    const handleOutsideClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ${darkMode ? 'bg-gray-900' : 'bg-black'}`}
                    onClick={handleOutsideClick}
                    aria-labelledby="modal-title"
                    role="dialog"
                    aria-modal="true"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div 
                        className={`p-6 rounded-lg shadow-lg w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 relative ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <button 
                            onClick={onClose} 
                            className="absolute top-3 right-3 p-1 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none"
                            aria-label="Close modal"
                        >
                            <X className="h-6 w-6 text-gray-600 hover:text-gray-800" />
                        </button>
                        {loading ? (
                            <div className="flex justify-center items-center h-full">
                                <Spinner size="large" />
                            </div>
                        ) : (
                            children
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    loading: PropTypes.bool, // New loading prop
};

export default Modal;
