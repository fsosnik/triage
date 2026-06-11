Los parámetros a configurar son:
* $T$: Temperatura. Entre 0 y 10. A menor temperatura más determinístico.
* $K$: top-K sampling. Entre 0 y 1. A menor K más factual.
* $P$: top-P sampling. Entre 0 y 1. A mayor P usará una jerga más rigurosa.

Recomendación: $Z = log_{10}T + (P-K)j$ El módulo de Z debe ser 1.


| Acción       | Variable    | Fórmula                  |
| ------------ | ----------- | ------------------------ |
| Recondiciona | Temperatura | $10^\sqrt{1-(P-K)^2}$    |
| Recondiciona | top-P       | $K+\sqrt{1-log_{10}^2T}$ |
| Recondiciona | top-K       | $P-\sqrt{1-log_{10}^2T}$ |
| Aumenta      | Temperatura | $\sqrt{10·T}$            |
| Reduce       | Temperatura | $T/2$                    |
| Aumenta      | top-K       | ${K+1}\over 2$           |
| Reduce       | top-K       | $K\over 2$               |
| Aumenta      | top-P       | ${P+1}\over 2$           |
| Reduce       | top-P       | $K\over 2$               |

A la hora de hacer una acción se debe considerar qué variable cambia y cuál se deja como pivote fija, para recondicionar a la tercera.


| Cambio      | Fija        | Recondiciona | Ejemplo                                                                          |
| ----------- | ----------- | ------------ | -------------------------------------------------------------------------------- |
| Temperatura | top-P       | top-K        | Queremos que mantenga el rigor técnico del ensayo usando otras palabras.         |
| Temperatura | top-K       | top-P        | Queremos que se adapte a una nueva jerga a partir de un nuevo enfoque artístico. |
| top-P       | Temperatura | top-K        | El rigor del lenguaje debe cambiar, junto con la manera de elegir sus palabras.  |
| top-P       | top-K       | Temperatura  | Debe cambiar el rigor, cuando moralmente está bien enfocado.                     |
| top-K       | Temperatura | top-P        | Se demanda un nuevo enfoque suave que cambie lo que se expone                    |
| top-K       | top-P       | Temperatura  | Se demanda un nuevo enfoque duro que cambie lo que se expone                     |


Las técnicas de prompting mencionadas en el documento incluyen:

#### Zero-shot prompting: Se proporciona solo una descripción de la tarea sin ejemplos previos.
Un ejemplo de zero-shot prompting podría ser el siguiente:

Prompt: *Describe cómo hacer una taza de café*.

En este caso, el modelo no recibe ejemplos ni información adicional. Solo se le pide directamente que proporcione una descripción de la tarea. La calidad y utilidad de la respuesta dependerán de la claridad del prompt y del conocimiento previo del modelo sobre el tema. 
#### Few-shot prompting: Implica proporcionar algunos ejemplos relevantes para guiar la respuesta.
Un ejemplo de few-shot prompting podría ser el siguiente:

Prompt: 


"*Clasifica los siguientes alimentos en 'fruta' o 'no fruta'*:
1. Manzana: Fruta
2. Zanahoria: No fruta
3. Plátano: Fruta
4. Pepino: No fruta
5. Fresa: Fruta"


En este caso, se proporcionan múltiples ejemplos de alimentos categorizados, lo que ayuda al modelo a entender el patrón y la estructura deseada para completar la tarea de forma eficaz. 

#### System prompting: Guía cómo el modelo debe generar texto en función de ciertas instrucciones.
Un ejemplo de system prompting podría ser el siguiente:

Prompt: *Eres un traductor de idiomas. Tu tarea es traducir el siguiente texto del inglés al español: 'Hello, how are you?*

En este caso, el prompt establece el contexto general y la función que debe desempeñar el modelo, guiándolo a realizar una tarea específica (la traducción) de manera clara. 

#### Contextual prompting: Utiliza el contexto específico para influir en la salida del modelo.
Un ejemplo de contextual prompting podría ser el siguiente:

Prompt: *En el contexto de una conversación sobre los beneficios de una dieta saludable, ¿puedes enumerar algunas frutas que serían recomendadas para incluir en una dieta equilibrada?*

Este prompt proporciona información pertinente que establece el trasfondo de la conversación, ayudando al modelo a comprender mejor lo que se espera en la respuesta. 

#### Role prompting: Especifica la voz y el estilo del modelo, añadiendo personalización.
Un ejemplo de rol prompting podría ser el siguiente:

Prompt: *Quiero que actúes como un nutricionista experto. Dame un plan de comidas para alguien que quiere perder peso, incluyendo recomendaciones de desayuno, almuerzo y cena.*

En este caso, el prompt asigna un rol específico al modelo (nutricionista experto), lo que ayuda a guiar las respuestas hacia un estilo y contenido más alineados con ese papel. 

#### Step-back prompting: Mejora el rendimiento al hacer que el modelo considere primero una pregunta general relacionada.
Un ejemplo de step-back prompting podría ser el siguiente:

Prompt: *Antes de analizar cómo reducir el estrés en el trabajo, reflexiona sobre qué es el estrés y cuáles son sus posibles causas. Luego, presenta algunas estrategias para manejarlo eficazmente.*

Este prompt primero invita al modelo a considerar aspectos generales sobre el estrés antes de abordar soluciones específicas, lo que puede ayudar a fomentar una respuesta más completa y bien fundamentada. 

#### Self-consistency prompting: Genera múltiples perspectivas y selecciona la respuesta más consistente.
Un ejemplo de self-consistency prompting podría ser el siguiente:

Prompt: *Por favor, responde a la siguiente pregunta desde diferentes perspectivas: ¿Es importante hacer ejercicio regularmente? Genera al menos tres respuestas diferentes antes de ofrecer una conclusión final.*

En este caso, el modelo genera múltiples respuestas a la misma pregunta, y después se selecciona la respuesta más consistente o común entre ellas para llegar a una conclusión más fiable. 

#### Tree of Thoughts (ToT): Genera múltiples prompts y evalúa sus resultados para seleccionar los mejores.
Un ejemplo de Tree of Thoughts prompting podría ser el siguiente:

Prompt: *Imagina que estás planeando un viaje. Comienza enumerando las diferentes etapas del viaje, como decidir el destino, planificar el alojamiento y organizar actividades. Para cada etapa, desarrolla al menos dos ideas o consideraciones que debes tener en cuenta.*

Este tipo de prompting invita al modelo a desglosar el problema en pasos más pequeños (el árbol de pensamientos), lo que facilita la exploración de cada aspecto del viaje en mayor profundidad y permite generar una respuesta más estructurada y completa. 


#### Multimodal prompting: Utiliza múltiples formatos de entrada para guiar el modelo.
Un ejemplo de multimodal prompting podría ser el siguiente:

Prompt: *Te proporcionaré una imagen de un paisaje montañoso. Describe lo que ves en la imagen y luego sugiere actividades que podrían realizarse en ese entorno, como senderismo o fotografía de naturaleza.*

En este ejemplo, el prompt utiliza múltiples formatos de entrada (una imagen y texto) para guiar la respuesta del modelo, lo que permite generar una respuesta más rica y contextualizada basada en la combinación de datos visuales y textuales. (Página 43)

Estas técnicas permiten adaptar la forma en que interactuamos con modelos de lenguaje para mejorar la calidad de las respuestas generadas. 


#### React prompting. Combina Reason y Act.
Un ejemplo de ReAct prompting podría ser el siguiente:

Prompt: ;*Quiero que actúes como un asistente de investigación. Primero, busca información sobre los efectos del cambio climático en los ecosistemas marinos. Luego, resume tus hallazgos y proporciona un enlace a un estudio relevante.*

En este caso, el modelo no solo debe razonar sobre el tema, sino que también debe realizar una búsqueda externa para recopilar información, reflejando cómo los humanos combinan el razonamiento y la acción. 

``` python
from langchain.agents import load_tools  
from langchain.agents import initialize_agent  
from langchain.agents import AgentType  
from langchain.llms import VertexAI  

prompt = "How many kids do the band members of Metallica have?"  
llm = VertexAI(temperature=0.1)  
tools = load_tools(["serpapi"], llm=llm)  
agent = initialize_agent(tools, llm,  
agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True)  
agent.run(prompt)
```

Respuesta:
```
Prompt Engineering  
September 2024 39  
Unset  
> Entering new AgentExecutor chain...  
Metallica has 4 members.  
Action: Search  
Action Input: How many kids does James Hetfield have?  
Observation: three children  
Thought: 1/4 Metallica band members have 3 children  
Action: Search  
Action Input: How many kids does Lars Ulrich have?  
Observation: 3  
Thought: 2/4 Metallica band members have 6 children  
Action: Search  
Action Input: How many kids does Kirk Hammett have?  
Observation: Hammett has been married to his second wife Lani since 1998.  
They have two sons, Angel (b. September 29, 2006) and Vincenzo (b. June  
28, 2008).  
Thought: 3/4 Metallica band members have 8 children  
Action: Search  
Action Input: How many kids does Robert Trujillo have?  
Observation: 2  
Thought: 4/4 Metallica band members have 10 children  
Final Answer: 10
```

#### Automatic Prompt Engineering (APE). 
Plantea una manera de listar opciones, un criterio de evaluación y listarlo de mejor a peor.

Un ejemplo de Automatic Prompt Engineering podría ser el siguiente:

Prompt: *Eres un asistente virtual diseñado para ayudar a los clientes a realizar pedidos en línea de camisetas de bandas. Genera un conjunto de prompts que podrían cubrir las diferentes formas en que los clientes podrían solicitar una camiseta. Por ejemplo, recopila variaciones de frases como 'Quiero comprar una camiseta de mi banda favorita' o '¿Tienen camisetas de la banda XYZ?'. Asegúrate de incluir diferentes estilos de comunicación, como preguntas, afirmaciones y solicitudes formales e informales.*

Este enfoque permite que el modelo produzca múltiples variaciones de solicitudes de los clientes, lo que resulta útil para entrenar un chatbot en el contexto de una tienda de camisetas. 

