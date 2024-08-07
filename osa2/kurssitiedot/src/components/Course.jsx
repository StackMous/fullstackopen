const Header = ({ course }) => <h2>{course}</h2>

const Total = ({ sum }) => <h3>Total of exercises {sum}</h3>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => {
  return(
    <>
      {parts.map(part =>
        <Part key={part.id} part={part}/>
      )}
    </>
  )
}

const Course = ({course}) => {
  const totalExercises = course.parts.reduce(
    (total, part) => total + part.exercises, 0
  )
  return(
    <>
    <Header course={course.name} />
    <Content parts={course.parts} />
    <Total sum={totalExercises}/>
    </>
  )
}

export default Course