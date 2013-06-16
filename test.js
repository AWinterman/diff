var test = require("tape")
var Differ = require("index.js")


var a = "a,b,c,d,e,f,g,h,i,j,k,l".replace(',', '\n')
  , b = "0,1,2,3,4,5,6,7,8,9".replace(',', '\n')


diff = new Differ

// these are kinda integration tests?
test("all different", funciton(t) {
  t.plan(1)
  t.equal(diff.difftext(a, b), "12.10.0.0*")
})


test("all the same", funciton(t) {
  t.plan(1)
  var a = "a,b,c,d,e,f,g,h,i,j,k,l".replace(',', '\n')
    , b = a
  assert.equal(diff.difftext(a, b), "", "all-same test failed.")
})

test("test the snake"){
  t.plan(1)
  // test snake
  var a = "a,b,c,d,e,f".replace(',', '\n')
    , b = "b,c,d,e,f,x".replace(',', '\n')
  t.equal(diff.difftext(a, b)), "1.0.0.0*0.1.6.5*", "snake test failed.")
})

// I'm not sure what the following mean, so I'm holding off on converting them.
// // 2002.09.20 - repro
// a = "c1,a,c2,b,c,d,e,g,h,i,j,c3,k,l".replace(',', '\n')
// b = "C1,a,C2,b,c,d,e,I1,e,g,h,i,j,C3,k,I2,l".replace(',', '\n')
// System.Diagnostics.Debug.Assert(TestHelper(Diff.DiffText(a, b, false, false, false))
//   == "1.1.0.0*1.1.2.2*0.2.7.7*1.1.11.13*0.1.13.15*",
//   "repro20020920 test failed.")
// System.Diagnostics.Debug.WriteLine("repro20020920 test passed.")
// 
// // 2003.02.07 - repro
// a = "F".replace(',', '\n')
// b = "0,F,1,2,3,4,5,6,7".replace(',', '\n')
// System.Diagnostics.Debug.Assert(TestHelper(Diff.DiffText(a, b, false, false, false))
//   == "0.1.0.0*0.7.1.2*", 
//   "repro20030207 test failed.")
// System.Diagnostics.Debug.WriteLine("repro20030207 test passed.")
// 
// // Muegel - repro
// a = "HELLO\nWORLD"
// b = "\n\nhello\n\n\n\nworld\n"
// System.Diagnostics.Debug.Assert(TestHelper(Diff.DiffText(a, b, false, false, false))
//   == "2.8.0.0*", 
//   "repro20030409 test failed.")
// System.Diagnostics.Debug.WriteLine("repro20030409 test passed.")
 

// test some differences
test("some difference", function(t){
  var a = "a,b,-,c,d,e,f,f".replace(',', '\n')
    , b = "a,b,x,c,e,f".replace(',', '\n')
  t.equal(
      diff.difftext(a, b)
    , "1.1.2.2*1.0.4.4*1.0.7.6*"
    , "some-changes test failed."
  )
})

test("one diff in a lot of repeats", function(t) {
  // test one change within long chain of repeats
  var a = "a,a,a,a,a,a,a,a,a,a".replace(',', '\n')
    , b = "a,a,a,a,-,a,a,a,a,a".replace(',', '\n')
  t.equal(
      diff.difftext(a, b)
    , "0.1.4.4*1.0.9.10*"
    , "long chain of repeats test failed."
  )
})



