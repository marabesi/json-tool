import { ReactElement } from 'react';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: ReactElement
}

const Drawer = ({ open, setOpen, children }: Props) => {
  const transitionVisible = open ? 'opacity-100 duration-50 ease-in-out visible': 'opacity-0 duration-50 ease-in-out invisible';
  const transitionWidth = open ? 'translate-x-0': 'translate-x-full';
  return (
    <div
      id="dialog-right"
      className="relative z-10"
      aria-labelledby="slide-over"
      role="dialog"
      aria-modal="true"
      onClick={() => setOpen(!open)}
    >
      <div
        data-testid="drawer"
        className={`fixed inset-0 bg-gray-500 bg-opacity-75 transition-all ${transitionVisible}`}
      ></div>
      <div className={open ? 'fixed inset-0 overflow-hidden' : ''}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed w-4/12 inset-y-0 right-0">
            <div
              className={`pointer-events-auto relative w-full h-full transform transition ease-in-out duration-500 ${transitionWidth}`}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
            >
              <div
                className='flex h-full w-full overflow-y-scroll p-2 shadow-xl bg-blue-400 text-gray-100 dark:text-gray-400 dark:bg-gray-600'
              >
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
