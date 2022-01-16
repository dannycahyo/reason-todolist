[@bs.val] external fetch: string => Js.Promise.t('a) = "fetch";

type fetchingState =
  | Initial
  | LoadingTodos
  | ErrorFetchingTodos
  | LoadedTodos(array(Activities.todosRecord))
  | EmptyTodos;

type action =
  | Fetch
  | FetchSuccess
  | FetchError
  | FetchEmpty;

let makeState = (state: fetchingState, action: action) => {
  switch (state) {
  | Initial =>
    switch (action) {
    | Fetch => LoadingTodos
    | FetchSuccess
    | FetchError
    | FetchEmpty => state
    }
  | LoadingTodos =>
    switch (action) {
    | Fetch => state
    | FetchSuccess => LoadedTodos([||])
    | FetchError => ErrorFetchingTodos
    | FetchEmpty => EmptyTodos
    }
  | ErrorFetchingTodos => state
  | LoadedTodos(_) => state
  | EmptyTodos => state
  };
};

let containerStyle =
  ReactDOMRe.Style.make(
    ~display="flex",
    ~flexDirection="column",
    ~alignItems="center",
    ~justifyContent="center",
    (),
  );

let addActivityButton =
  ReactDOMRe.Style.make(
    ~background="#48a9dc",
    ~color="white",
    ~borderRadius="4px",
    (),
  );

[@react.component]
let make = () => {
  let (fetchingState, setFetchingState) = React.useState(() => Initial);

  let (activityValue, setActivityValue) = React.useState(() => "");
  let (descriptionValue, setDescriptionValue) = React.useState(() => "");

  React.useEffect0(() => {
    setFetchingState(state => makeState(state, Fetch));
    Js.Promise.(
      fetch("http://localhost:3000/todos")
      |> then_(response => response##json())
      |> then_(jsonResponse => {
           setFetchingState(state =>
             jsonResponse->Js.Array2.length > 0
               ? LoadedTodos(jsonResponse)  // makeState(state, FetchSuccess)
               : makeState(state, FetchEmpty)
           );
           Js.Promise.resolve();
         })
      |> catch(_ => {
           setFetchingState(state => makeState(state, FetchError));
           Js.Promise.resolve();
         })
      |> ignore
    );

    None;
  });

  let handleAddTodo = dataTodos => {
    let newTodo = Js.Dict.empty();
    Js.Dict.set(
      newTodo,
      "id",
      Js.Json.string(Js.Float.toString(Js.Math.random())),
    );
    Js.Dict.set(newTodo, "title", Js.Json.string(activityValue));
    Js.Dict.set(newTodo, "description", Js.Json.string(descriptionValue));

    Js.Promise.(
      Fetch.fetchWithInit(
        "http://localhost:3000/todos",
        Fetch.RequestInit.make(
          ~method_=Post,
          ~headers=
            Fetch.HeadersInit.make({"Content-Type": "application/json"}),
          ~body=
            Fetch.BodyInit.make(
              Js.Json.stringify(Js.Json.object_(newTodo)),
            ),
          (),
        ),
      )
      |> then_(Fetch.Response.json)
      |> then_(_ => {
           //  setFetchingState(state => makeState(state, FetchSuccess))
           Js.Promise.resolve()
         })
      |> catch(_ => {
           setFetchingState(state => makeState(state, FetchError));
           Js.Promise.resolve();
         })
      |> ignore
    );

    let newTodo2: Activities.todosRecord = {
      id: activityValue,
      title: activityValue,
      description: descriptionValue,
    };
    let updatedTodos: array(Activities.todosRecord) =
      Array.append(dataTodos, [|newTodo2|]);
    setFetchingState(_ => LoadedTodos(updatedTodos));

    setActivityValue(_ => "");
    setDescriptionValue(_ => "");
  };

  let handleDeleteTodo = (dataTodos, id: string) => {
    Js.Promise.(
      Fetch.fetchWithInit(
        "http://localhost:3000/todos/" ++ id,
        Fetch.RequestInit.make(~method_=Delete, ()),
      )
      |> then_(Fetch.Response.json)
      |> ignore
    );

    let updatedTodos: array(Activities.todosRecord) =
      dataTodos->Js.Array2.filter((todo: Activities.todosRecord) =>
        todo.id !== id
      );
    setFetchingState(_ => LoadedTodos(updatedTodos));
    // setFetchingState(state => makeState(state, FetchSuccess))
  };

  let handleEditTodo = (~dataTodos, ~todoId, ~editedTitle, ~editedDescription) => {
    let updatedTodoJson = Js.Dict.empty();
    Js.Dict.set(updatedTodoJson, "id", Js.Json.string(todoId));
    Js.Dict.set(updatedTodoJson, "title", Js.Json.string(editedTitle));
    Js.Dict.set(
      updatedTodoJson,
      "description",
      Js.Json.string(editedDescription),
    );

    Js.Promise.(
      Fetch.fetchWithInit(
        "http://localhost:3000/todos/" ++ todoId,
        Fetch.RequestInit.make(
          ~method_=Put,
          ~headers=
            Fetch.HeadersInit.make({"Content-Type": "application/json"}),
          ~body=
            Fetch.BodyInit.make(
              Js.Json.stringify(Js.Json.object_(updatedTodoJson)),
            ),
          (),
        ),
      )
      |> then_(Fetch.Response.json)
      |> ignore
    );

    let currentIndex =
      dataTodos->Js.Array2.findIndex((todo: Activities.todosRecord) =>
        todo.id === todoId
      );

    let updatedTodo: Activities.todosRecord = {
      id: todoId,
      title: editedTitle,
      description: editedDescription,
    };

    let updatedTodos: array(Activities.todosRecord) =
      Array.append([||], dataTodos);
    updatedTodos[currentIndex] = updatedTodo;

    setFetchingState(_ => LoadedTodos(updatedTodos));
  };

  <div>
    <div>
      {switch (fetchingState) {
       | Initial
       | LoadingTodos => React.string("Loading ....")
       | EmptyTodos =>
         <button onClick={_ => setFetchingState(_ => LoadedTodos([||]))} />
       | LoadedTodos(dataTodos) =>
         <>
           <div style=containerStyle>
             <input
               type_="text"
               placeholder="What are you doing?"
               value=activityValue
               onChange={event => {
                 // let value = ReactEvent.Form.target(event)##value;
                 let value = event->ReactEvent.Form.target##value;
                 setActivityValue(_ => value);
               }}
             />
             <input
               type_="text"
               placeholder="Be detail please!!!"
               value=descriptionValue
               onChange={event => {
                 let value = ReactEvent.Form.target(event)##value;
                 setDescriptionValue(_ => value);
               }}
             />
             <button
               style=addActivityButton
               onClick={_event => handleAddTodo(dataTodos)}>
               {React.string("Add activity")}
             </button>
           </div>
           {dataTodos
            ->Js.Array2.filter(_todo => true)
            ->Belt.Array.map(todo => {
                <Activities
                  todosData=todo
                  key={todo.id}
                  onDeleteTodos={id => handleDeleteTodo(dataTodos, id)}
                  onEditTodos={(
                    ~todoId: string,
                    ~editedTitle: string,
                    ~editedDescription: string,
                  ) =>
                    handleEditTodo(
                      ~todoId,
                      ~editedTitle,
                      ~editedDescription,
                      ~dataTodos,
                    )
                  }
                />
              })
            ->React.array}
         </>
       | ErrorFetchingTodos => React.string("An Error Occured!")
       }}
    </div>
  </div>;
};
