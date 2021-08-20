/**
 * Copyright (c) 2020-present, Goldman Sachs
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { createContext, useContext } from 'react';
import { useLocalObservable } from 'mobx-react-lite';
import { SetupStore } from '../../stores/SetupStore';
import { guaranteeNonNullable } from '@finos/legend-shared';
import { useApplicationStore } from '../application/ApplicationStoreProvider';

const SetupStoreContext = createContext<SetupStore | undefined>(undefined);

export const SetupStoreProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const applicationStore = useApplicationStore();
  const store = useLocalObservable(() => new SetupStore(applicationStore));
  return (
    <SetupStoreContext.Provider value={store}>
      {children}
    </SetupStoreContext.Provider>
  );
};

export const useSetupStore = (): SetupStore =>
  guaranteeNonNullable(
    useContext(SetupStoreContext),
    'useSetupStore() hook must be used inside SetupStore context provider',
  );