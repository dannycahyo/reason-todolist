[@bs.val] external fetch: string => Js.Promise.t('a) = "fetch";

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
  let (dataTodos, setDataTodos) = React.useState(() => [||]);
  let (loading, setLoading) = React.useState(() => false);
  let (error, setError) = React.useState(() => false);

  let (activityValue, setActivityValue) = React.useState(() => "");
  let (descriptionValue, setDescriptionValue) = React.useState(() => "");

  React.useEffect0(() => {
    setLoading(_ => true);
    setError(_ => false);
    Js.Promise.(
      fetch("http://localhost:3000/todos")
      |> then_(response => response##json())
      |> then_(jsonResponse => {
           setDataTodos(_prevTodos => jsonResponse);
           setLoading(_ => false);
           Js.Promise.resolve();
         })
      |> catch(_ => {
           setError(_ => true);
           setDataTodos(_prevTodos => [||]);
           setLoading(_ => false);
           Js.Promise.resolve();
         })
      |> ignore
    );

    None;
  });

  let handleAddTodo = () => {
    let newTodo = Js.Dict.empty();
    Js.Dict.set(
      newTodo,
      "id",
      Js.Json.string(string_of_float(Js.Math.random())),
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
      |> ignore
    );

    let newTodo2: Activities.todosRecord = {
      id: activityValue,
      title: activityValue,
      description: descriptionValue,
    };
    let updatedTodos: array(Activities.todosRecord) =
      Array.append(dataTodos, [|newTodo2|]);
    setDataTodos(_ => updatedTodos);

    setActivityValue(_ => "");
    setDescriptionValue(_ => "");
  };

  let handleDeleteTodo = (id: string) => {
    Js.Promise.(
      Fetch.fetchWithInit(
        "http://localhost:3000/todos/" ++ id,
        Fetch.RequestInit.make(~method_=Delete, ()),
      )
      |> then_(Fetch.Response.json)
      |> ignore
    );

    let updatedTodo: array(Activities.todosRecord) =
      dataTodos->Js.Array2.filter(todo => todo.id !== id);
    setDataTodos(_prevTodos => updatedTodo);
  };

  let handleEditTodo = (~todoId, ~editedTitle, ~editedDescription) => {
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
      dataTodos->Js.Array2.findIndex(todo => todo.id === todoId);

    let updatedTodo: Activities.todosRecord = {
      id: todoId,
      title: editedTitle,
      description: editedDescription,
    };

    let updatedTodos: array(Activities.todosRecord) =
      Array.append([||], dataTodos);
    updatedTodos[currentIndex] = updatedTodo;

    setDataTodos(_prevTodos => updatedTodos);
  };

  <div>
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
      <button style=addActivityButton onClick={_event => handleAddTodo()}>
        {React.string("Add activity")}
      </button>
    </div>
    <div>
      {error ? React.string("An Error Occured!") : React.null}
      {loading ? React.string("Loading ....") : React.null}
      {dataTodos->Js.Array2.length > 0
         ? dataTodos
           ->Js.Array2.filter(_todo => true)
           ->Belt.Array.map(todo => {
               <Activities
                 todosData=todo
                 key={todo.id}
                 onDeleteTodos=handleDeleteTodo
                 onEditTodos=handleEditTodo
               />
             })
           ->React.array
         : React.string("There is no activity yet")}
    </div>
  </div>;
};
