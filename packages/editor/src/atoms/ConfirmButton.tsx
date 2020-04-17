import React, { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from 'semantic-ui-react';
import styled from 'styled-components';

const Portal = styled.div`
  position: fixed;
  z-index: 100;
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const ModalContainer = styled.div`
  position: fixed;
  display: flex;
  z-index: 101;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const Modal = styled.div`
  background: #fff;
  margin: auto;
  width: 400px;
  min-height: 100px;
  padding: 20px;
  border-radius: 4px;
`;

export const ConfirmButton: React.FC<{ message: string; onClick: () => void }> = ({ message, onClick, children }) => {
  const portalEl = useRef<HTMLElement>();
  const [ready, setIsReady] = useState(false);
  const containerRef = useRef<any>();

  useLayoutEffect(() => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    portalEl.current = element;

    return () => {
      portalEl.current = undefined;
      document.body.removeChild(element);
    };
  }, []);

  return (
    <>
      {ready && portalEl.current
        ? createPortal(
            <>
              <Portal />
              <ModalContainer
                ref={containerRef}
                onClick={e => {
                  if (e.target !== containerRef.current) {
                    return;
                  }
                  setIsReady(false);
                }}
              >
                <Modal>
                  <h3>{message}</h3>
                  <span onClick={onClick}>{children}</span> <Button onClick={() => setIsReady(false)}>Cancel</Button>
                </Modal>
              </ModalContainer>
            </>,
            portalEl.current
          )
        : null}
      <span onClick={() => setIsReady(true)}>{children}</span>
    </>
  );
};
