(module
 (type $i32_i32_=>_i32 (func_subtype (param i32 i32) (result i32) func))
 (global $export/a i32 (i32.const 1))
 (global $export/b i32 (i32.const 2))
 (global $export/c i32 (i32.const 3))
 (memory $0 0)
 (export "add" (func $export/add))
 (export "sub" (func $export/sub))
 (export "renamed_mul" (func $export/mul))
 (export "a" (global $export/a))
 (export "b" (global $export/b))
 (export "renamed_c" (global $export/c))
 (export "memory" (memory $0))
 (func $export/add (type $i32_i32_=>_i32) (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  local.get $1
  i32.add
 )
 (func $export/sub (type $i32_i32_=>_i32) (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  local.get $1
  i32.sub
 )
 (func $export/mul (type $i32_i32_=>_i32) (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  local.get $1
  i32.mul
 )
)
